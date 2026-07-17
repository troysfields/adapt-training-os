# Deployment Guide — GitHub Repo Live Launch

This repo is designed to be **launch-ready in 3 minutes**.

## Option 1: GitHub Pages (Zero config, static)

Perfect for personal use, client-side ICU mode.

1. **Create GitHub repo**

```bash
cd adaptive-training
git init
git add .
git commit -m "launch ADAPT v2 + ICU integration"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/adapt-training-os.git
git push -u origin main
```

2. **Enable Pages**

- Repo → Settings → Pages → Source: GitHub Actions
- The included workflow `.github/workflows/deploy.yml` will build and deploy automatically on push to main
- Build uses Vite, but fallback copies `index.html` to `dist/` if no build
- After first push, Actions → deploy → live URL: `https://YOUR_USERNAME.github.io/adapt-training-os/`

3. **Test**

Open live URL, do Setup, test localStorage persistence. Export JSON.

**Note for ICU:** GitHub Pages is static hosting — no env vars. Use client-side direct mode (API key in localStorage) or point proxy URL to external Vercel/Worker.

## Option 2: Vercel (Recommended for ICU proxy + production)

Best for secure API key + custom domain.

1. **Push to GitHub** (same as above)

2. **Import to Vercel**

- vercel.com → Add New Project → Import GitHub repo
- Framework preset: Vite
- Build command: `npm run build`
- Output: `dist`

3. **Env vars**

Settings → Environment Variables:

```
INTERVALS_API_KEY = your_intervals_icu_api_key
```

Optional: `NODE_ENV=production`

4. **Deploy**

Vercel auto-deploys. Proxy at `https://your-app.vercel.app/api/intervals?endpoint=...`

In app → Intervals.icu tab → Enable Proxy Mode → Proxy URL = `/api/intervals` → Save → Test

5. **Custom domain (optional)**

Vercel → Settings → Domains → add `adapt.yourdomain.com`

## Option 3: Netlify

Similar to Vercel, but proxy needs function config:

- Create `netlify/functions/intervals.js` (copy from `api/intervals.js`, adapt handler)
- `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"
```

- Env: `INTERVALS_API_KEY`
- Build & deploy.

## Option 4: Cloudflare Pages + Worker

- Pages for static, Worker for proxy (`public/intervals-worker.js`)
- Deploy worker: `wrangler deploy`
- Set Pages env var pointing to worker URL as proxy.

## Option 5: Local / Offline

- Just double-click `index.html` — works offline (no proxy). For USB stick, personal use.
- Or `npx serve .` → http://localhost:3000

## Checklist Before Public Launch

- [ ] Update README.md with your live URL
- [ ] Ensure `manifest.json` start_url correct
- [ ] Set OG image / favicon if you want
- [ ] Remove demo seeded workouts? (clear localStorage `adapt_seeded_v3`)
- [ ] Add disclaimer: not medical advice, API key security
- [ ] Test in Incognito for first-time onboarding flow
- [ ] Test mobile responsive (tabs, modals)
- [ ] Test export/import
- [ ] If public, default to Proxy Mode and don't require user API key? Prompt user to add their own.

## GitHub Repo Polish

- Add Topics: `fitness`, `training`, `adaptive`, `intervals-icu`, `PWA`, `vite`
- About section: link to live demo
- Create Release v1.0.0 from main, attach `dist.zip`
- Enable Issues + Discussions

## Updating

Push to main → auto deploys via Actions. For Vercel, auto-deploys on every push if connected.

## Costs

- GitHub Pages: free
- Vercel hobby: free (proxy included)
- Intervals.icu API: free, no key limits for personal
