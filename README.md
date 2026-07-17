# ADAPT v2 — Adaptive Training OS

> **Highly intuitive training log that rewrites your plan daily based on readiness, RPE, and compliance. Now with Intervals.icu sync.**

![ADAPT](https://img.shields.io/badge/Status-Launch%20Ready-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue) ![Intervals.icu](https://img.shields.io/badge/Integration-Intervals.icu-%23007AFF) ![PWA](https://img.shields.io/badge/PWA-Ready-purple)

**Live Demo:**
- **App (Vercel, with ICU proxy):** https://adapt-training-os.vercel.app
- **App (GitHub Pages):** https://troysfields.github.io/adapt-training-os/
- **Repo:** https://github.com/troysfields/adapt-training-os
- **ICU Proxy:** `/api/intervals` (Vercel serverless, `INTERVALS_API_KEY` in encrypted env)

Or just open `index.html` locally.

### Why ADAPT is different

Most training logs are dead spreadsheets. ADAPT is a **control loop**:

1. **Morning Readiness (12 sec)** — 5 sliders: Sleep, Soreness, Stress, Motivation, Energy → Score 0-100
2. **Auto Rewrite** — Today’s workout adjusts intensity/volume. Bad sleep? Hard VO2 becomes Recovery Flow. Feeling primed? +10% progression.
3. **Log RPE Honestly** — After training, 1-10 RPE. System learns fatigue.
4. **No Guilt Adaptation** — Missed 2? Plan redistributes. RPE 9 twice? Volume -10%. Easy for 3 days? +5% overload.
5. **Intervals.icu Guardrail** — If ATL/CTL >1.5, auto deload bias. Pull real load, push planned workouts to ICU calendar.

### Quick Start (30 seconds)

**Option A: Just run it**
```bash
# No build needed — it's a single static app
open index.html
# or
npx serve .
```

**Option B: Vite dev (for Fable 5 / Claude Cowork)**
```bash
npm install
npm run dev # → http://localhost:5173
npm run build # outputs to /dist
```

**Option C: One-click deploy**
- Vercel: `vercel --prod` (auto-detects `api/intervals.js` proxy)
- Netlify: drag `dist/` or connect repo
- GitHub Pages: push to main → Action auto-deploys via `.github/workflows/deploy.yml`

### Features

- ✅ **Today View**: Adapted workout, readiness dial, week strip, compliance/fatigue KPIs
- ✅ **Plan View**: 28-day adaptive roadmap, load chart (planned vs actual vs ICU CTL), swap engine
- ✅ **Log View**: Calendar heatmap, history, volume breakdown, ICU import
- ✅ **Insights View**: Trend line, focus suggestions, deload logic
- ✅ **Intervals.icu Tab**: Full sync center — pull activities/wellness, push workouts to calendar
- ✅ **PWA Ready**: manifest.json, offline localStorage, export JSON
- ✅ **100% Local First**: No backend required, but proxy included for production

### Intervals.icu Integration

See `docs/INTERVALS_ICU_INTEGRATION.md`

**TL;DR:**
1. Get Athlete ID (iXXXX from URL) and API Key from intervals.icu/settings
2. In ADAPT → Intervals.icu tab → paste ID + Key → Save → Test Connection
3. Pull 30d activities → they auto-convert to ADAPT logs
4. Log new workout → auto pushes to ICU calendar if checked
5. For production: set `INTERVALS_API_KEY` env var in Vercel and enable Proxy Mode

Endpoints used:
- `GET /athlete/{id}` — validate
- `GET /athlete/{id}/activities?oldest=&newest=` — import
- `GET /athlete/{id}/wellness?oldest=&newest=` — ATL/CTL/HRV for guardrails
- `POST /athlete/{id}/events` — push planned workouts

### File Structure

```
adapt-training/
├── index.html              # The entire app (launch-ready, no build needed)
├── manifest.json           # PWA
├── package.json            # For Vite + Fable 5 workflow
├── vite.config.js
├── api/
│   └── intervals.js        # Vercel serverless proxy (secure API key)
├── public/
│   └── intervals-worker.js # Cloudflare Worker alternative proxy
├── .github/workflows/deploy.yml # GitHub Pages auto-deploy
├── vercel.json
├── docs/
│   ├── MANUAL.md           # Full user manual
│   ├── INTERVALS_ICU_INTEGRATION.md
│   ├── DEPLOYMENT.md       # GitHub + Vercel launch guide
│   └── CLAUDE_COWORK_GUIDE.md # Fable 5 / Claude Cowork instructions
├── CLAUDE.md               # Instructions for Claude Code
└── README.md
```

### Fable 5 / Claude Cowork

If you use Claude Cowork (Fable 5):

1. Drop this folder into your Cowork project
2. Claude will read `CLAUDE.md` automatically
3. Prompt: *"Launch ADAPT with Intervals.icu sync enabled, deploy to GitHub Pages"*
4. Claude knows to edit `index.html`, wire `/api/intervals.js`, set env vars

Full guide: `docs/CLAUDE_COWORK_GUIDE.md`

### Environment Variables

Create `.env` for local proxy testing, Vercel env for prod:

```
INTERVALS_API_KEY=your_icu_api_key_here
# optional
PROXY_TARGET=https://intervals.icu
```

### Roadmap for launch

- [x] Single-file launch-ready app
- [x] Adaptive engine (readiness + RPE + missed logic)
- [x] Intervals.icu read/write
- [x] PWA + export
- [ ] OAuth (Intervals.icu doesn't support OAuth, Basic auth is correct)
- [ ] Strava direct (use ICU as bridge for now — recommended)
- [ ] Mobile app wrapper (Capacitor)

### License

MIT — do whatever you want. Attribution appreciated.

### Credits

Built for athletes who hate guilt-based plans. Designed in Grand Junction, CO.
