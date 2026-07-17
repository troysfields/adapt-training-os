# FABLE 5 MASTER LAUNCH PACK — ADAPT v2
### Single-File Autonomous Task for Claude Cowork to Build + Deploy ADAPT Training OS with Intervals.icu

> **DROP THIS FILE INTO YOUR FABLE 5 CLAUDE COWORK PROJECT AND PROMPT:**
> "Execute FABLE5_MASTER_LAUNCH_PACK.md autonomously. Build ADAPT v2 fully, push to my GitHub, deploy to Vercel, wire Intervals.icu proxy, verify live."

---

## 1. MISSION

Build and launch **ADAPT v2 — Adaptive Training OS** — a highly intuitive training log that rewrites your plan daily based on readiness, RPE, compliance, and Intervals.icu ATL/CTL.

**Launch Targets:**
- GitHub repo `adapt-training-os` (public) → GitHub Pages live via Actions
- Vercel project `adapt-training-os` → live with serverless proxy `/api/intervals` for secure Intervals.icu integration
- Intervals.icu bi-directional sync: pull activities/wellness, push planned workouts

Success = live URLs working, Test Connection passes, calendar push works.

---

## 2. WHAT YOU HAVE IN SOURCE FOLDER (`/home/user/adaptive-training/`)

This folder ALREADY CONTAINS launch-ready code (built in previous turn):

```
index.html (74KB) — THE APP, single-file vanilla JS, dark UI, all tabs, ICU sync logic
manifest.json — PWA manifest
package.json — Vite + gh-pages
vite.config.js — base ./, outDir dist
vercel.json — rewrites /api + SPA fallback
api/intervals.js — Vercel serverless proxy (reads INTERVALS_API_KEY env)
public/intervals-worker.js — Cloudflare Worker alternative
.github/workflows/deploy.yml — GitHub Pages auto-deploy on push main
docs/MANUAL.md, INTERVALS_ICU_INTEGRATION.md, DEPLOYMENT.md, CLAUDE_COWORK_GUIDE.md
CLAUDE.md — instructions Claude Code reads
```

**Do NOT rewrite index.html from scratch.** Use the existing file as canonical. It's fully functional. Only fix if build breaks. Your job is deployment + wiring, not redesign.

---

## 3. CREDENTIALS CLAUDE NEEDS (Ask user if missing)

Prompt user once at start:

- `GITHUB_USERNAME` — e.g. `yourname` (for remote URL)
- `GITHUB_PAT`? Optional — if not logged in, use `gh auth login`
- `VERCEL_TOKEN`? Optional — if not logged in, use `vercel login`
- `INTERVALS_API_KEY` — from https://intervals.icu/settings API Key (secret)
- `INTERVALS_ATHLETE_ID` — from URL: intervals.icu/athlete/ **i123456** /...

Store secrets ONLY in:
- Local `.env.local` (gitignored)
- Vercel env: `vercel env add INTERVALS_API_KEY production`
- GitHub repo secrets? NOT NEEDED — app uses localStorage + Vercel env, not GitHub secrets

Never commit API key to git. Never echo in logs.

---

## 4. AUTONOMOUS EXECUTION PLAN FOR CLAUDE

Execute in order, stop on failure and explain.

### STEP 0 — Verify Local Build

```bash
cd /path/to/adaptive-training
npm install
npm run build
# Must output dist/index.html ~73KB + dist/manifest.json + dist/intervals-worker.js
ls -lh dist/
# If build fails with parse error on "< 40%" — fix by replacing "<" with "&lt;" and ">" with "&gt;" in HTML text nodes inside rules card
```

### STEP 1 — GitHub Repo Creation + Push

```bash
# Ensure gh cli
gh --version || { echo "install gh"; exit 1; }
gh auth status || gh auth login

# Init git if not
git init
git add .
git commit -m "launch ADAPT v2 + ICU integration — Fable 5 autonomous"

# Create repo (if not exists) — replace YOUR_GITHUB_USERNAME
gh repo create adapt-training-os --public --source=. --remote=origin --push --description "ADAPT v2 — Adaptive Training OS with Intervals.icu sync. Auto-adjusts plan from readiness/RPE/CTL"

# If repo exists, just push:
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/adapt-training-os.git 2>/dev/null || git remote set-url origin https://github.com/YOUR_GITHUB_USERNAME/adapt-training-os.git
git push -u origin main

# Verify GitHub Actions workflow exists: .github/workflows/deploy.yml
# Enable Pages: gh api repos/YOUR_GITHUB_USERNAME/adapt-training-os/pages -X POST -f source.branch=gh-pages || echo "Pages will be enabled via Actions"
```

Expected: GitHub Actions tab shows "Deploy ADAPT to GitHub Pages" run → green → live at `https://YOUR_GITHUB_USERNAME.github.io/adapt-training-os/`

### STEP 2 — Vercel Deploy with Proxy

```bash
vercel --version || npm i -g vercel
vercel login  # if needed

# Link project
vercel link --yes  # or vercel --confirm

# Set env var securely (will prompt for value — paste INTERVALS_API_KEY)
echo "Setting INTERVALS_API_KEY env in Vercel..."
printf "%s" "$INTERVALS_API_KEY" | vercel env add INTERVALS_API_KEY production
printf "%s" "$INTERVALS_API_KEY" | vercel env add INTERVALS_API_KEY preview
printf "%s" "$INTERVALS_API_KEY" | vercel env add INTERVALS_API_KEY development

# Deploy prod
vercel --prod --yes

# Output: https://adapt-training-os-xxxx.vercel.app
```

Verify:
- Open `https://your-vercel-url.vercel.app` → app loads
- Open `https://your-vercel-url.vercel.app/api/intervals?endpoint=/athlete/iTEST` should return 400 if key missing, or proper if key works (test with real athlete ID)

### STEP 3 — Wire Intervals.icu in App

After deploy, open app live URL → Intervals.icu tab

Inputs:
- Athlete ID = `INTERVALS_ATHLETE_ID` (user provided)
- Enable Proxy Mode = ON
- Proxy URL = `/api/intervals` (default for Vercel)
- API Key field can be blank (server uses env) OR filled for direct if user wants local override

Click Save Locally → Test Connection → should see "✅ Connected! Athlete: {name}"

If fails:
- Check Vercel logs: `vercel logs your-url`
- Check env var set: `vercel env ls`
- Fallback: disable proxy mode and test direct client call (will fail if CORS, but confirms key valid)

Then click:
- Fetch Wellness → should show CTL/ATL
- Fetch Activities → should import last 30d and show in list + add to Log tab
- Push Today → should create event in https://intervals.icu/athlete/{id}/calendar

### STEP 4 — Final QA Checklist

- [ ] `npm run dev` → onboarding works, readiness dial updates, log save works, localStorage persists
- [ ] `npm run build` → creates dist/index.html
- [ ] GitHub Pages live URL loads app, no 404
- [ ] Vercel live URL loads app
- [ ] Vercel `/api/intervals?endpoint=/athlete/{id}` returns 200 with athlete data when env set
- [ ] In app (Vercel URL) → Intervals.icu tab → Test Connection = success
- [ ] Push Today creates event in ICU calendar
- [ ] Pull Activities imports to Log
- [ ] README has live URLs updated
- [ ] No API key in git history: `git log -p | grep INTERVALS_API_KEY` should show nothing

---

## 5. CRITICAL FILES CONTENT (If Claude needs to recreate)

Claude, if any file missing, recreate exactly as below:

### package.json
```json
{
  "name": "adapt-training-os",
  "version": "1.0.0",
  "description": "ADAPT — Adaptive Training OS. Highly intuitive training log that auto-adjusts intensity from readiness, RPE, and compliance. Intervals.icu integrated.",
  "type": "module",
  "scripts": {
    "dev": "vite --host --port 5173",
    "build": "vite build",
    "preview": "vite preview --port 4173",
    "deploy": "gh-pages -d dist"
  },
  "license": "MIT",
  "devDependencies": {
    "vite": "^5.4.0",
    "gh-pages": "^6.1.1"
  }
}
```

### vite.config.js
```js
import { defineConfig } from 'vite'
export default defineConfig({
  base: './',
  server: { port: 5173 },
  build: { outDir: 'dist', assetsDir: 'assets' }
})
```

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "functions": { "api/intervals.js": { "includeFiles": "**" } },
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### api/intervals.js (Vercel Proxy — SECURE)
```js
// Vercel Serverless Proxy for Intervals.icu API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { endpoint, athleteId } = req.query;
  const apiKey = process.env.INTERVALS_API_KEY || req.headers['x-api-key'];
  if (!apiKey) return res.status(400).json({ error: 'Missing INTERVALS_API_KEY env or x-api-key header' });
  if (!endpoint) return res.status(400).json({ error: 'Missing ?endpoint=' });
  const url = `https://intervals.icu/api/v1${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`API_KEY:${apiKey}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    const text = await response.text();
    let data; try { data = JSON.parse(text); } catch { data = text; }
    res.status(response.status).json(data);
  } catch (e) { res.status(500).json({ error: e.message }); }
}
```

### .github/workflows/deploy.yml
```yaml
name: Deploy ADAPT to GitHub Pages
on:
  push: { branches: [main, master] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: "pages", cancel-in-progress: false }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci || npm install
      - run: npm run build
      - run: |
          if [ ! -f dist/index.html ]; then mkdir -p dist; cp index.html dist/; fi
          cp manifest.json dist/ 2>/dev/null || true
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
  deploy:
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    needs: build
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### .gitignore
```
node_modules
dist
.env
.env.local
.DS_Store
.vercel
.netlify
```

### manifest.json
```json
{
  "name": "ADAPT — Adaptive Training OS",
  "short_name": "ADAPT",
  "description": "Intuitive training log that auto-adjusts from readiness, RPE, compliance. Intervals.icu integrated.",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#0a0a0b",
  "theme_color": "#C6FF2A",
  "icons": [{ "src": "https://api.iconify.design/lucide:activity.svg?color=%23C6FF2A", "sizes": "192x192", "type": "image/svg+xml" }]
}
```

### index.html — DO NOT RECREATE, USE EXISTING FILE at `index.html` (74KB)
It contains full app + Intervals integration logic. If missing, restore from workspace backup. Key functions inside:
- `generatePlan()` `calcReadinessScore()` `adaptToday()` `intervalsFetch()` `fetchIcuActivities()` `fetchIcuWellness()` `pushWorkoutToIcu()`

---

## 6. INTERVALS.ICU INTEGRATION SPEC (For Claude)

**Auth:** Basic `API_KEY:<apiKey>` base64
**Base:** `https://intervals.icu/api/v1`
**Athlete ID format:** `i123456`

Endpoints:
- GET `/athlete/{id}` → test
- GET `/athlete/{id}/activities?oldest=YYYY-MM-DD&newest=YYYY-MM-DD` → import, returns array with `id, start_date_local, type, name, distance, moving_time, icu_training_load, perceived_exertion`
- GET `/athlete/{id}/wellness?oldest=&newest=` → returns array of wellness objects with `ctl, atl, rampRate, hrv, restingHR, sleepSecs`
- POST `/athlete/{id}/events` → push planned workout body: `{start_date_local: "2026-07-18T08:00:00", category:"WORKOUT", name, description, type: Run|Ride|WeightTraining|Workout}`

Mapping in app:
- Run→run, Ride/VirtualRide→cycle, WeightTraining→strength, Walk/Yoga→mobility
- RPE = perceived_exertion or icu_training_load/15 clamped 3-10
- Duration = moving_time/60

Guardrail: if atl/ctl >1.5 and workout hard → downgrade.

---

## 7. HOW TO HANDLE SECRETS AUTONOMOUSLY

- NEVER write INTERVALS_API_KEY into code, markdown, or git
- For local dev, create `.env.local` (gitignored) with `INTERVALS_API_KEY=...`
- For Vercel, use `vercel env add` which stores encrypted
- For GitHub, NO secret needed — client uses proxy so key stays server-side
- In app UI, key goes to localStorage `adapt_v3_state.intervals.apiKey` — acceptable for personal private deployment. For public, leave blank and rely on proxy env

When prompting user for secrets, do:

```
To complete launch I need:
1. Your GitHub username (for remote)
2. Intervals.icu Athlete ID (i....)
3. Intervals.icu API Key (will be stored only as Vercel env var, not in repo)

Please paste Athlete ID and API Key, or say "skip ICU for now"
```

---

## 8. FULL AUTONOMOUS COMMAND SEQUENCE (Claude can run)

```bash
# 0. CD to repo
cd /path/to/adaptive-training

# 1. Install + build check
npm ci || npm install
npm run build
ls dist/index.html

# 2. GitHub
gh auth status || gh auth login
git add .
git commit -m "autonomous launch ADAPT v2 Fable5 $(date -I)" || echo "no changes"
gh repo create adapt-training-os --public --source=. --remote=origin --push  --description "ADAPT v2 — Adaptive Training OS + Intervals.icu" 2>&1 || { git push -u origin main; }

# Wait for GH Pages Action to start
sleep 5
gh run list --limit 3

# 3. Vercel
vercel --version || npm i -g vercel
vercel link --yes 2>&1 || vercel --yes  # first time

# Set env
echo "Set INTERVALS_API_KEY now — paste when prompted"
vercel env add INTERVALS_API_KEY production
vercel env add INTERVALS_API_KEY preview

# Deploy
vercel --prod --yes | tee vercel-url.txt

# 4. Output URLs
cat vercel-url.txt
echo "GitHub Pages will be at https://$(gh api user --jq .login).github.io/adapt-training-os/"
```

---

## 9. SUCCESS CRITERIA

Launch is DONE when:

- GitHub repo exists and `main` branch has all files, Actions workflow succeeded
- GitHub Pages URL loads app, onboarding works
- Vercel URL loads app
- Vercel `/api/intervals?endpoint=/athlete/{id}` returns athlete JSON (200) not 400
- In Vercel app, Intervals.icu tab Test Connection shows ✅
- Push Today creates event in https://intervals.icu/athlete/{id}/calendar (verify manually or via GET /events)
- README.md updated with live URLs

Provide user final summary:

```
✅ ADAPT v2 Launched
- GitHub: https://github.com/USER/adapt-training-os
- GitHub Pages: https://USER.github.io/adapt-training-os/
- Vercel: https://adapt-training-os-xxxx.vercel.app
- Vercel Proxy: /api/intervals
- ICU Connected: i123456 / Test OK
- Actions: 7d pull, today's push tested
```

---

## 10. TROUBLESHOOTING FOR CLAUDE

- **Vite build fails parse5 invalid-first-character-of-tag-name** → search for "< 40%" or "<" in text, replace with "&lt;" and ">" with "&gt;" inside HTML text nodes (not inside JS)
- **gh auth fails** → prompt user to run `gh auth login` manually, then continue
- **vercel env add fails file exists** → `vercel env rm INTERVALS_API_KEY production` then add again
- **CORS error on ICU direct** → expected — tell user to enable Proxy Mode (toggle on) and ensure Vercel env set + redeploy
- **ICU 401** → wrong API key or Athlete ID missing 'i' prefix
- **GitHub Pages 404** → ensure `.github/workflows/deploy.yml` pushes `dist/` and Pages set to GitHub Actions source
- **dist missing manifest.json** → `cp manifest.json dist/` before push, Vite doesn't auto-copy from root unless in public/

---

## 11. FABLE 5 ORCHESTRATION (If user wants Scout/Coach agents)

After launch, add to Fable 5 master `fable5.yaml`:

```yaml
modules:
  adapt-training-os:
    path: ./adapt-training-os
    deploy: vercel+github-pages
    cron:
      scout:
        schedule: "0 */6 * * *" # every 6h
        task: "If intervals.connected, fetch wellness, if HRV drop >10% or sleep <6h, set readiness.sore=2 sleep=2 and saveState"
      deploy:
        schedule: "0 0 * * *"
        task: "git pull origin main && npm run build && vercel --prod"
```

---

## 12. WHAT TO RETURN TO USER

At end, Claude must return:

1. Live URLs (GitHub repo, GitHub Pages, Vercel)
2. Screenshot or curl proof of proxy working
3. Confirmation ICU Test Connection passed (athlete name)
4. Instructions how to use app daily (from docs/MANUAL.md)
5. How to update: `git push` auto-deploys both

---

**END OF MASTER PACK — EXECUTE AUTONOMOUSLY**

> Note: This single file plus existing `index.html` (74KB app) is all Claude needs. No external context required. All docs are already inside repo under `docs/` — this file is the orchestrator.

