# Fable 5 / Claude Cowork Guide

> This doc is for using this repo inside **Claude Code (Cowork)** — your Fable 5 workspace.

## What is Fable 5?

Fable 5 is your master Cowork project that orchestrates sub-agents. ADAPT is a module inside it.

## How Claude Cowork Uses This Repo

Claude Code reads `CLAUDE.md` at repo root. That file tells Claude:

- What the project is
- How to run it
- How to integrate Intervals.icu
- Where to put secrets
- Deployment targets

### CLAUDE.md Summary

```
- Run with `npm run dev` or open index.html
- Proxy is at /api/intervals.js (Vercel) — needs INTERVALS_API_KEY env
- State is localStorage key adapt_v3_state
- All logic in single file index.html (vanilla JS) for speed — do NOT split unless requested
- To add feature, edit inline <script> block
```

## Prompts for Claude Cowork

Use these in Cowork chat after importing folder:

**Launch & Deploy:**
> "Launch ADAPT v2. Setup GitHub repo, test Intervals.icu integration with proxy mode, and deploy to Vercel with env INTERVALS_API_KEY. Use the docs in /docs."

**Add Feature:**
> "Add a workout_doc builder for Intervals.icu — when pushing to ICU, convert ADAPT's tempo workout into structured intervals (warmup 10min 65% FTP, 3x7min 88% FTP). Follow api.html structure."

**Customize for User:**
> "I'm training for a half marathon in Grand Junction, 5 days/week, 60min sessions. Regenerate library for endurance focus with trail specifics and import last 30 days from my ICU id iXXXX."

**Fix CORS:**
> "I'm getting CORS on direct ICU call. Switch app to proxy mode by default and ensure vercel.json rewrites /api to function. Test with fetch."

**Mobile PWA:**
> "Wrap ADAPT as installable PWA — add service worker caching index.html + manifest, icons, offline fallback."

## Project Structure for Cowork

Cowork should understand:

- `index.html` = monolithic app (intentionally single-file for launch speed)
- If you want separation, extract `<style>` → `src/styles.css`, `<script>` → `src/app.js` but keep Vite entry.
- Keep `api/intervals.js` as Vercel function.
- Keep docs for human onboarding.

## Secrets Handling in Cowork

- Never paste real INTERVALS_API_KEY into code.
- In Cowork, use ENV panel or `.env.local` (gitignored).
- For Vercel deploy, set via Claude → `vercel env add INTERVALS_API_KEY`

## Tasks You Can Assign to Claude

1. **Security Audit**: "Audit index.html for XSS via innerHTML, ensure ICU key not logged."
2. **Tests**: "Add Playwright smoke test: onboarding → readiness → log → export → ICU test mock."
3. **Strava Bridge**: "Document that Strava → Intervals.icu is the recommended bridge, not direct Strava, to avoid OAuth complexity."
4. **Analytics**: "Add optional Plausible analytics, GDPR compliant."
5. **Custom Domain**: "Deploy to adapt.fable5.app with SSL."

## Fable 5 Integration

If Fable 5 has multiple agents:

- **Scout Agent**: Pulls ICU wellness daily, feeds to ADAPT readiness pre-fill
- **Coach Agent**: Reads ADAPT notes + ICU ATL/CTL, writes daily motivation via OpenAI in coach notes area
- **Deploy Agent**: Watches main branch, auto-deploys to GitHub Pages + Vercel
- **Sync Agent**: Cron every 6h → calls `fetchIcuActivities()` if connected

You can wire these as separate Cowork sub-tasks with this repo as source.

## Quick Commands for Terminal Inside Cowork

```bash
# dev
npm i && npm run dev

# build preview
npm run build && npm run preview

# deploy to vercel from cowork
vercel --prod --env INTERVALS_API_KEY=@intervals-key

# deploy to gh pages manually
npm run build && npx gh-pages -d dist
```

## What Claude Should NOT Do

- Don't eject to React/Next unless user asks — single-file is feature for launch.
- Don't hardcode athlete ID or API key.
- Don't remove localStorage fallback.
- Don't add heavy dependencies.

## Done Definition

Repo is ready when:

- `npm run dev` loads app, onboarding works
- Intervals tab Test Connection works in proxy mode
- `npm run build` creates dist/index.html
- `vercel --prod` deploys + /api/intervals responds 401 without key, 200 with key
- README live URL updated
