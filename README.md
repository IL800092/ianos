# IAN.OS

Personal life-management dashboard. React + Vite, runs on any machine, deploys to GitHub Pages (same workflow as StudyHub).

## Run it

```bash
npm install     # school WiFi blocks npm — use phone hotspot
npm run dev     # local dev at http://localhost:5173
npm run build   # production build → dist/
```

Deploy to GitHub Pages: push, then either use gh-pages (`npm i -D gh-pages` and add `"deploy": "gh-pages -d dist"`) or a Pages action — same as studyhub.

## Structure

```
src/
├── main.jsx            entry point
├── App.jsx             shell: tabs, state, save/load, MIGRATIONS
├── theme.js            all colors + shared styles (edit look here)
├── storage.js          persistence adapter (see below)
├── data/seed.js        default data + weekly training plan
├── utils/dates.js      date helpers
├── components/
│   ├── ui.jsx           Card, Eyebrow, Check, XBtn
│   └── Runway.jsx       milestone countdown strip
└── pages/
    ├── Today.jsx        runway + today's session + tasks
    ├── Calendar.jsx     month grid + per-day events
    ├── Uni.jsx          UK Medicine + NA Mechatronics checklists
    ├── Train.jsx        weekly split (static plan)
    ├── Gym.jsx          exercise dropdown tracker with dated history
    └── Projects.jsx     project cards
```

## Storage

All data lives as one JSON blob under the key `ianos:v1`.
`storage.js` auto-detects the environment:

- **Claude artifact** → `window.storage` (persistent artifact storage)
- **Anywhere else** (vite dev, GitHub Pages) → `localStorage`

⚠️ These do NOT sync with each other. The artifact version and the deployed version each keep their own data.

## Editing later (with any AI model or by hand)

- Drop this whole folder into a chat / Claude Code and describe the change — `CLAUDE.md` has the context a model needs.
- To use an updated version **as a Claude artifact again**: ask the model to bundle `src/` back into a single .jsx file (inline the imports, keep `window.storage`).
- New top-level data section? Add it to `SEED` in `data/seed.js` **and** patch it in `migrate()` in `App.jsx` so existing saved data picks it up.
