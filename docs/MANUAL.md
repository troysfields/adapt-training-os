# ADAPT Manual — Full User Guide

## Concept

ADAPT is not a static training plan. It's a dynamic control system.

**Inputs:**
- Morning readiness (Sleep 1-5, Soreness 1-5, Stress 1-5, Motivation 1-5, Energy 1-5)
- Post-workout RPE 1-10
- Compliance (did you show up?)
- Optional: Intervals.icu wellness (ATL, CTL, HRV, RHR)

**Output:** Today's workout rewritten to keep you at 70-85% effort — where growth lives.

## Daily Flow (2 minutes)

**Morning (30 sec):**
1. Open ADAPT → Today tab
2. Adjust 5 sliders intuitively. Don't overthink. 3 = average.
3. Score appears. Click **Update Today's Plan →**
4. Read the ADAPT note: e.g., "Readiness 52% → reduced intensity 30%"

**Train (your session)**
- Title, duration, RPE are suggestions. Adapt on the fly if needed.

**Post-Train (30 sec):**
1. **✓ Mark done + Log RPE** or hit **+ FAB**
2. Choose type, duration, RPE (how hard it felt, not how hard it was supposed to be), notes
3. Save. If ICU connected and "Push to ICU" checked, it also creates ICU event (or you can push manually)

## Adaptive Rules — The Brain

These are hard-coded in `adaptToday()` function:

| Condition | Action | Why |
|-----------|--------|-----|
| Readiness <38% | Replace with Recovery Flow 22min walk+mobility | Protect tomorrow, keep habit streak |
| Readiness 38-57% + workout badge=hard | Dur ×0.7, badge mid, RPE -2 | Reduce intensity 30% |
| Readiness >85% + avg RPE <6 last 3 | Dur ×1.1, RPE +1 | You are primed, +10% stimulus |
| Avg RPE ≥8.5 last 3 | Dur ×0.85 this session | Fatigue creeping |
| ≥2 missed in last 7d | Hard → mid for re-entry | No punishment, just re-entry |
| ICU ATL/CTL >1.5 | Hard → mid, note | Intervals.icu form risk |
| No triggers | +2-5% overload hint | Progressive overload |

**Adaptation Counter** increments each time we soften or raise stimulus. You can see it in Insights.

## Views Deep Dive

### Today
- **Hero Card**: Today's adapted workout. Badge: easy/mid/hard/recovery. Meta chips.
- **ADAPT Note**: Explains *why* it adapted. This builds trust.
- **Week Strip**: Next 7 days, scrollable. Tap to swap any day. Done checkmarks.

### Plan
- **Roadmap**: Next 12 planned. Shows badge, duration.
- **Load Chart**: Dashed = planned load (duration × RPE/6), Solid lime = actual, Blue line = ICU CTL approximation or fatigue guardrail.
- **Coach Notes**: Auto-generated txt based on RPE trend, missed, ICU form.
- **Push Week to ICU**: Button pushes next 7 days to Intervals.icu calendar as WORKOUT events.

### Log
- **Calendar**: Mon-Sun. Dot = has log. Click day to log/edit.
- **History**: Filterable list. Shows RPE bar.
- **Volume Breakdown**: Bar per type (run, strength, cycle, mobility)
- **Import ICU**: Redundant button for quick import.

### Insights
- **KPIs**: Best streak, avg RPE, adaptations
- **Trend Canvas**: Simple vanilla JS line chart of last 30 logs (load = duration × RPE/6). Dots colored by RPE.
- **Focus Next**: Rule engine suggests what to add.

### Intervals.icu
- **Sync Center**: API key + Athlete ID + Proxy Mode
- **Actions**: Fetch activities, fetch wellness, push plan, push today
- **Activities List**: Latest ICU pulls, with load
- **Wellness**: CTL, ATL, Form, HRV/RHR

## Setup Onboarding

Setup flow (3 steps):
1. Goal: hybrid / endurance / strength / fatloss — changes workout library
2. Equipment: gym, dumbbells, bodyweight, run, bike — future filter (currently advisory)
3. Days/week, session length, avoid notes

Generates 28-day plan immediately. Library:

- **endurance**: easy aerobic, tempo builder, VO2 intervals, long, recovery flow
- **strength**: push, pull, legs, full body pump
- **hybrid**: upper, lower+sprint, conditioning engine, easy miles, full core
- **fatloss**: fat loss circuit, intervals+core, walk+lift light, metcon mix

Level scales duration: beginner ×0.8, advanced ×1.15, then averaged with your sessionLen pref.

## Data Model

Stored in localStorage `adapt_v3_state`:

```js
{
  profile: {goal, level, days, equip[], sessionLen, avoid},
  readiness: {sleep, sore, stress, motiv, energy, score, checked, date},
  workouts: [{id, date, duration, title, rpe, type, notes, icuId?, load?}],
  plan: [{date, title, desc, type, dur, rpe, badge, planned, id}],
  stats: {streak, bestStreak, adaptations},
  intervals: {apiKey, athleteId, useProxy, proxyUrl, connected, lastSync, lastWellness, cacheActivities}
}
```

Export button downloads this JSON. Import? Just replace localStorage or use devtools.

## Tips for Intuitive Use

- Don't log what you *should* have done. Log what you *did* + RPE.
- RPE guide: 3=Recovery (could double), 5=Easy (nose breathing), 7=Moderate (can talk in phrases), 8=Hard (few words), 9=Very hard (couldn't do one more set), 10=Max.
- If life hits, still open app and set readiness low. Getting a Recovery Flow day keeps your streak and habit > intensity.
- Use Swap liberally. No ego.

## Troubleshooting

- Calendar not showing? Check calCursor in state.
- ICU CORS error? Enable Proxy Mode + deploy to Vercel with env var.
- Lost data? Check localStorage, export often.

## Future Enhancements You Can Build

- Push structured workout_doc to ICU (intervals.icu supports workout_doc JSON for power/HR targets)
- Pull HRV into readiness auto-score
- Voice log: "Log yesterday 45 min easy run RPE 6"
- Wearable webhook (Whoop/Oura → readiness)
