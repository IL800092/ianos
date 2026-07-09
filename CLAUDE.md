# Context for AI models editing this project

## What this is
IAN.OS // JARVIS — an Iron-Man-HUD life dashboard for Ian, a Grade 12 student
(Bayview Glen, Toronto) applying to university for Fall 2027 entry. The whole
site is ONE self-contained file: `index.html` at the repo root (inline CSS +
JS, Google Fonts only external dependency). No build step, no frameworks, no
API keys. Deployed to GitHub Pages by `.github/workflows/deploy.yml` on push
to `main`.

The earlier React/Vite "life OS" was scrapped in July 2026 (recoverable from
git history on `main` before that date). Do not reintroduce a build step or
framework.

## Owner context baked into the seed data
- Two university lanes: UK Medicine (UCAT summer 2026, UCAS deadline Oct 15
  2026) and North America Mechatronics (SAT retake Aug/Sep 2026 targeting
  1450–1500, OUAC Waterloo/McMaster/TMU, US Common App, UC Berkeley test-blind).
- Grade 11 avg 97; AP Calc/Bio/Chem/Physics + Music + English.
- Training: vertical jump program (power clean, half squat, RDL, Bulgarian SS
  jumps; Isaiah Rivera iso protocol; Nippard Fundamentals uppers). 5'9" → rim.
- Projects: ClinicOS (EMR, 11,254-drug DB), StudyHub, WWMF Canadian Regional
  Director, portfolio. 10+ yrs alto sax and piano.

## Architecture rules
1. **The panels array is the whole app state.** A panel spec is:
   `{"id":"kebab-case","title":"...","tab":"...","sections":[{"label":"...or null","rows":[{"l":"...","sub":"?","r":"...","warn":true?,"meter":0-100?,"due":"YYYY-MM-DD"?}]}]}`
   This exact shape is also the AI exchange protocol (see below). Rows with a
   `due` date get their countdown computed at render time — never bake
   countdown strings into stored state.
2. **Persistence**: the `store` adapter (top of the script) tries
   `window.storage` (Claude artifacts) → `localStorage` → in-memory. Panels
   key: `ianos-jarvis-panels-v6`. Keep that key stable — it's what makes saved
   dashboards survive edits.
3. **Command pipeline order matters**: pasted protocol JSON → `localIntent()`
   (fixed commands, then `localEdit()` mutations, then keyword panel-opens) →
   AI uplink (`ROUTES`, auto-failover) → `offlineEdit()` fallback → error +
   toast. The local edit parser must stay BEFORE the keyword-opens, or messages
   like "I hit 125 on power clean" get swallowed by the "clean" keyword.
4. **AI protocol**: replies must be ONE raw JSON object:
   `{"reply","action":"open|create|update|delete|none","panelId","spec"}`.
   `update` carries the complete spec; `delete` refuses `CORE_IDS`
   (schedule, apps, training, projects). Parse with `extractJSON`
   (brace-matching, survives fences/prose), one retry with a "raw JSON only"
   nudge.
5. **Escape everything**: any user/AI string hitting innerHTML goes through
   `escH()`. No exceptions.
6. **Visual identity (do not deviate)**: near-black `#030812`, blue `#4da8ff`,
   bright `#a8dcff`, muted `#5b7ba6`, amber `#ffb454` for warnings only.
   Chakra Petch (titles) + JetBrains Mono (body). Frosted panels,
   `cubic-bezier(.16,1,.3,1)` springs. Three layouts: desktop (panels dock
   right), phone portrait (bottom sheets), phone landscape (orb left, panel
   right). Respect `prefers-reduced-motion` (CSS *and* the orb's `REDUCED`
   flag).
7. **No paid APIs, no keys, no third-party accounts.** The uplink routes are
   free-only (claude.ai proxy, `window.claude.complete`, optional user-supplied
   worker URL via `set uplink`). The paste pipeline (`export` → Claude chat →
   paste JSON back) must always work as the fallback brain.

## Using it as a Claude artifact
The file already prefers `window.storage` when present — it can be pasted into
an artifact as-is (single file, no imports needed).
