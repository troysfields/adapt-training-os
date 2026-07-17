# Intervals.icu Integration — Full Guide

ADAPT integrates bi-directionally with Intervals.icu.

## Why Intervals.icu?

- It's the most powerful free training analytics platform
- Already syncs with Strava, Garmin, Wahoo, Coros, Apple Watch, etc.
- Provides CTL/ATL/Form, HRV, RHR, load calculations
- Acts as bridge — you don't need direct Strava API

So flow is: **Watch → Strava → Intervals.icu → ADAPT (read) → ADAPT plan → Intervals.icu calendar (write) → Watch**

## API Basics

Base: `https://intervals.icu/api/v1`

Auth: **Basic Auth** — username `API_KEY`, password = your API key. Header:
```
Authorization: Basic base64("API_KEY:your_api_key")
```

Docs: https://intervals.icu/api.html

Athlete ID: In URL when logged in: `https://intervals.icu/athlete/i123456/...` → `i123456`

### Key Endpoints ADAPT Uses

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/athlete/{id}` | Test connection, get name |
| GET | `/athlete/{id}/activities?oldest=YYYY-MM-DD&newest=YYYY-MM-DD` | Pull activities to import |
| GET | `/athlete/{id}/wellness?oldest=&newest=` | Pull ATL, CTL, HRV, RHR, sleep, weight |
| POST | `/athlete/{id}/events` | Push planned workout to calendar |
| GET | `/athlete/{id}/events?oldest=&newest=` | (future) fetch planned |
| PUT | `/athlete/{id}/wellness/{date}` | (future) push readiness |

## Setup — Local (Client-Side Direct)

For quick local use, paste API key directly in browser. Key stays in localStorage `adapt_v3_state.intervals.apiKey`. Never committed.

Steps in ADAPT UI:

1. Intervals.icu → Settings → API Settings → Copy API Key
2. Copy Athlete ID from URL
3. In ADAPT → Intervals.icu tab → paste both
4. **Disable Proxy Mode** for local file:// or localhost direct CORS test (Intervals.icu allows CORS for API key auth? Sometimes blocked — if so, enable proxy)
5. Save Locally → Test Connection

If you get CORS error in console, switch to Proxy Mode.

## Setup — Production (Vercel / Netlify / Cloudflare) — RECOMMENDED

**Never expose API key in client JS for public site.**

We include a secure proxy:

**Vercel:**
File: `/api/intervals.js`

```js
// Reads INTERVALS_API_KEY from env
// Client calls /api/intervals?endpoint=/athlete/i123/activities
// Server adds Basic Auth header
```

Deploy steps:

1. Push repo to GitHub
2. Import to Vercel
3. Settings → Environment Variables → Add `INTERVALS_API_KEY` = your ICU key
4. Deploy
5. In ADAPT UI → Intervals.icu tab → Enable Proxy Mode → Proxy URL = `/api/intervals` → paste Athlete ID → leave API key blank (server uses env) OR fill for extra auth → Save → Test

**Cloudflare Workers alternative:**
File: `public/intervals-worker.js`
Deploy with:
```bash
npx wrangler deploy --name adapt-icu-proxy --var INTERVALS_API_KEY:yourkey
```
Set proxy URL to worker URL.

## What ADAPT Syncs

### Pull Activities → ADAPT Log (One-way import)

`GET /athlete/{id}/activities`

Maps ICU fields:

- `id` → `icuId`
- `start_date_local` → `date`
- `moving_time/elapsed_time` → `duration` (minutes)
- `name/type` → `title`
- `perceived_exertion` → `rpe` else `icu_training_load/15` heuristic → RPE 3-10
- `type` mapping: Run→run, Ride/VirtualRide→cycle, WeightTraining→strength, Walk/Yoga→mobility else other
- `icu_training_load` → `load` (stored)
- Description includes distance, load, original desc

Deduplication by `icuId`. Only imports new.

Manual trigger: Button or automatic on load if you want (we leave manual to save calls).

### Pull Wellness → Guardrails

`GET /athlete/{id}/wellness?oldest={today-7}&newest={today}`

We store latest `ctl, atl, rampRate, hrv, restingHR, sleepSecs, weight` into `state.intervals.lastWellness`

Guardrail logic in `adaptToday()`:

```js
if (atl/ctl > 1.5 && workout badge hard) → downgrade to mid
```

Also shown in coach notes and load chart.

### Push Workouts → ICU Calendar

`POST /athlete/{id}/events`

Creates event:

```json
{
  "start_date_local": "2026-07-18T08:00:00",
  "category": "WORKOUT",
  "name": "Tempo Builder",
  "description": "ADAPT generated • RPE 7/10 • 48min...",
  "type": "Run"
}
```

You can later extend to include `workout_doc` for structured intervals. Example structured doc:

```json
{
  "workout_doc": {
    "duration": 2880,
    "steps": [
      {"duration": 600, "power": {"value": 65, "units": "% FTP"}},
      {"duration": 420, "repeat": 3, "steps": [
        {"duration": 420, "power": {"value": 88, "units": "% FTP"}},
        {"duration": 120, "power": {"value": 50, "units": "% FTP"}}
      ]}
    ]
  }
}
```

ADAPT currently pushes simple description (v1). v2 could generate workout_doc from library.

Push buttons:
- Push Today → pushes adapted today
- Push Week → pushes next 7 days with delay 400ms to avoid rate limit
- Auto-push on log when checkbox checked

Rate limits: Intervals.icu ~100 req/min, so weekly push with 400ms delay is safe.

## Security Notes

- Client-side mode: API key in localStorage, visible in devtools. Okay for personal private use. Not okay for public deployment.
- Proxy mode: API key in server env, not exposed. Client sends Athlete ID only + optional x-api-key header for extra.
- We never log API key in GitHub. `.gitignore` includes `.env`

## Testing Checklist

- [ ] Test connection returns athlete name
- [ ] Fetch activities returns JSON array, imports to log
- [ ] Fetch wellness returns array, shows CTL/ATL
- [ ] Push today creates event in intervals.icu calendar (check calendar view)
- [ ] Delete test event in ICU if needed
- [ ] Load chart shows blue line when CTL present

## Troubleshooting

**CORS blocked**
- Means direct browser call blocked. Enable Proxy Mode and deploy proxy.

**401 Unauthorized**
- Wrong API key or Athlete ID. Re-copy. Ensure ID includes 'i' prefix.

**404 athlete not found**
- Check ID format. Needs 'i' + numbers. e.g., i123456 not 123456.

**Events not showing in ICU**
- Check category = WORKOUT, date format YYYY-MM-DDTHH:MM:SS local. Ensure calendar view includes workouts.

**Duplicated imports**
- We dedupe by icuId. If you manually logged same date, you may have two entries (one manual, one ICU). Delete duplicate manually.

## Future: Webhooks

Intervals.icu supports webhooks (Settings → Webhooks) → you could set webhook to your Vercel function to auto pull on new activity. For now manual pull is simpler.

## References

- Intervals.icu API Docs: https://intervals.icu/api.html
- Forum: https://forum.intervals.icu/
- Proxy pattern: See `api/intervals.js`
