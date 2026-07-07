# Context for AI models editing this project

## What this is
IAN.OS — a personal dashboard built for Ian, a Grade 12 student (Bayview Glen, Toronto) applying to university for Fall 2027 entry. Built July 2026 in a Claude chat, exported here so future models can edit it.

## Owner context baked into the seed data
- Two university lanes: UK Medicine (UCAT summer 2026, UCAS deadline Oct 15 2026) and North America Mechatronics (SAT retake Aug/Sep 2026 targeting 1450–1500, UC apps Nov 30 2026, Canada OUAC).
- Training: Upper/Lower split for vertical jump (basketball). Lower A: iso holds → Power Clean → Half Squat → RDL. Lower B: iso holds → Bulgarian split squat jumps. Uppers: Jeff Nippard Fundamentals.
- Projects: ClinicOS (EMR, Vue+MongoDB), StudyHub (deployed), WWMF Regional Director, SDR radio, Skyky Foundation.

## Architecture rules
1. **One state object**, defined by `SEED` in `src/data/seed.js`. All mutations go through `update(fn)` in `App.jsx` (clone → mutate → debounced save).
2. **Persistence**: `src/storage.js` — `window.storage` in Claude artifacts, `localStorage` otherwise. Never import localStorage directly in components; always go through storage.js.
3. **Migrations**: adding a new top-level key to the data model? Patch it into `migrate()` in `App.jsx`, or existing users' saved states will crash on undefined.
4. **Styling**: inline styles only, tokens from `src/theme.js`. No CSS frameworks. Fonts: Archivo / Archivo Expanded (loaded in index.html).
5. **Design intent**: "training log meets mission control." Cool paper background, navy ink, cobalt for actions, red strictly for urgency (deadlines ≤30 days out). Mobile-first, bottom tab nav. Keep it minimal — dropdowns over sprawl.

## Rebundling as a Claude artifact
Concatenate everything into one .jsx: inline theme/utils/seed/storage/components/pages into a single file with `export default`, keep the `window.storage` branch, add the Google Fonts @import in a `<style>` tag (index.html isn't available in artifacts). The original single-file versions were built this way.
