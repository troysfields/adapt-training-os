# Import ADAPT into Fable 5 (Claude Cowork)

## Steps

1. **In Claude Cowork, create new project Fable 5** if not exists.

2. **Import repo:**

Cowork → Add Files → Drag entire `adaptive-training/` folder.

Or CLI inside Cowork terminal:

```bash
git clone https://github.com/YOUR_USERNAME/adapt-training-os.git adapt
```

3. **Verify Claude reads CLAUDE.md**

Prompt: "Read CLAUDE.md and summarize how to launch ADAPT with Intervals.icu"

Claude should respond with the correct flow.

4. **Set secrets in Cowork ENV panel**

Add:
- `INTERVALS_API_KEY` = your ICU key
- `INTERVALS_ATHLETE_ID` = iXXXX

5. **Launch dev**

Claude → Run: `npm install && npm run dev`

Should open preview on port 5173.

6. **Build + Deploy**

Prompt in Cowork:

> Deploy ADAPT to GitHub Pages and Vercel prod. Use proxy mode by default. Set vercel env INTERVALS_API_KEY from my secrets. Push to origin main.

Claude will:

- `npm run build`
- `vercel --prod`
- `git push`
- GitHub Action deploys Pages

7. **Import into Fable 5 orchestrator**

In Fable 5 master doc, add:

```yaml
modules:
  - name: adapt-training-os
    path: ./adapt
    type: pwa
    deploy: vercel+gh-pages
    integrations: [intervals.icu, strava_via_icu]
    agents: [scout, coach, deploy]
```

Scout agent prompt: "Every 6h, if intervals.connected, call fetchIcuWellness and pre-fill readiness if sleep <6h or HRV drop >10%."

Coach agent prompt: "Read ADAPT coachNotes + lastWellness, generate 1-sentence motivation using Fable 5 persona."

8. **Done**

ADAPT is now a Fable 5 submodule, live at your Vercel URL, auto-syncing ICU.

---

## Troubleshooting Fable 5 Import

- If Cowork can't find Vite: `npm install -g vite` or use `npx vite`
- If proxy fails: Ensure `api/intervals.js` is at repo root `/api` not `/src/api`
- If GitHub push fails: Set remote: `git remote set-url origin ...` using PAT
