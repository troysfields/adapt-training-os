# CLAUDE.md — Instructions for Claude Code (Fable 5 / Cowork)

This repo is **ADAPT v2 — Adaptive Training OS + Intervals.icu**

## Goal
Launch-ready, highly intuitive training log that auto-rewrites daily plan from readiness + RPE + compliance, with Intervals.icu sync.

## Stack
- **Primary file**: `index.html` — single-file App (vanilla JS, no framework). Intentional for instant launch.
- **Build tool**: Vite (`package.json` → `npm run dev` on 5173, `npm run build` → `dist/`)
- **Backend (optional)**: `api/intervals.js` — Vercel serverless proxy for Intervals.icu (secure API key). Alternative: `public/intervals-worker.js` for Cloudflare.
- **State**: localStorage key `adapt_v3_state` (includes profile, readiness, workouts[], plan[], intervals{}).
- **Styling**: Inlined CSS in index.html, dark theme, --accent #C6FF2A. Do not add Tailwind unless asked.
- **Charts**: Vanilla canvas (no Chart.js to avoid CDN in preview).
- **PWA**: `manifest.json`

## Key Functions in index.html <script>

- `generatePlan()` — builds 28-day plan from library + profile
- `calcReadinessScore()` — 5 sliders → 0-100
- `adaptToday()` — core adaptive brain. Reads readiness + avg RPE + missed + ICU ATL/CTL → rewrites today's workout + adaptNote
- `intervalsFetch(endpoint, method, body)` — handles both direct and proxy mode. Proxy uses ?endpoint= and x-api-key header. Direct uses Basic Auth header.
- `fetchIcuActivities()` — pull 30d, import to workouts[]
- `fetchIcuWellness()` — pull ATL/CTL/HRV
- `pushWorkoutToIcu(workout, date)` — POST /events

## Intervals.icu Integration Contract

- Auth: Basic `API_KEY:apiKey`
- Athlete ID: `i123456` from URL
- Endpoints used: `/athlete/{id}`, `/activities`, `/wellness`, `/events`
- Security: Client-side mode stores key in localStorage (personal). Production must use proxy + env `INTERVALS_API_KEY`. UI has toggle `useProxy`.
- To test: Paste ID+Key in Intervals.icu tab → Save → Test Connection → Fetch Activities

## How to Work on This Repo (for Claude)

1. **Do not split index.html unless user explicitly wants modularization.** Single-file is launch feature.
2. **Run**: `npm install && npm run dev` — edit `index.html` and HMR will reload.
3. **Build**: `npm run build` — ensures `dist/index.html` exists. If not, copy fallback.
4. **Deploy**: 
   - GitHub Pages via `.github/workflows/deploy.yml` on push main
   - Vercel: `vercel --prod` with env `INTERVALS_API_KEY`
5. **Never commit secrets**: `.env`, API keys. Use env vars.
6. **State resets**: `localStorage.removeItem('adapt_v3_state')` + reload for fresh onboarding.
7. **Add feature**: Edit inline script in index.html. Keep functions vanilla. Use `saveState()` + `renderAll()` after mutations.

## Common Tasks

- Add new workout type: Edit `LIB.hybrid` or other goal libraries.
- Add new adaptive rule: Edit `adaptToday()` — push reason string to `reason[]`.
- Make structured workout_doc for ICU: Extend `pushWorkoutToIcu()` to include `workout_doc` field per https://intervals.icu/api.html
- Add service worker: Create `public/sw.js` + register in index.html.
- Add analytics: Add <script> plausible before </head> if user asks.

## Deployment Targets

- Default: GitHub Pages + Vercel dual. Both configured.
- `vercel.json`: rewrites /api to functions, SPA fallback to index.html

## Testing Quick

- Open app → openOnboard → set 5 days → generate → readiness check → completeToday → save log → check logList + calendar
- Intervals tab → if no real key, mock test should fail gracefully with tip.

## Docs

- Full user manual: `docs/MANUAL.md`
- ICU guide: `docs/INTERVALS_ICU_INTEGRATION.md`
- Deploy guide: `docs/DEPLOYMENT.md`
- Cowork/Fable5: `docs/CLAUDE_COWORK_GUIDE.md`

## User Context

- Location: Grand Junction, CO
- Fable 5 is master orchestration project in Claude Cowork
- User wants: fully functional, launch-ready, GitHub repo, Intervals.icu integrated, instruction manual for Cowork

## Final Deliverable When Prompted "Launch"

1. Ensure index.html works standalone
2. Ensure package.json scripts work
3. Ensure api/intervals.js proxy secure
4. Ensure README has live URL placeholder filled if deployed
5. Update docs if needed
6. Provide copy-paste commands for GitHub creation + Vercel deploy

Never expose or return the API key in logs.
