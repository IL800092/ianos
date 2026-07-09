# IAN.OS // JARVIS

Iron-Man-HUD life-management dashboard. One self-contained static page —
`index.html` at the repo root. No build step, no frameworks, **no API keys or
external AI services**. Deploys to GitHub Pages automatically on push to `main`.

> The previous React/Vite "life OS" app was retired in July 2026 — it lives on
> in git history on `main` before that date. JARVIS replaced it as the whole site.

## Run it

- **Local:** just open `index.html` in a browser. That's it.
- **Deployed:** push to `main` → the Pages action publishes the repo root →
  https://il800092.github.io/ianos/

## How the intelligence works

Everything on the dashboard is a **panel spec** (JSON). The panels array is the
whole app state, persisted to localStorage under `ianos-jarvis-panels-v6`.
JARVIS can open, create, update, and delete panels — the first four core panels
(`schedule`, `apps`, `training`, `projects`) can't be deleted, only updated.

Three layers, tried in order:

1. **Local intents** — instant, offline: open panels by keyword, plus a local
   edit parser for common mutations (no AI involved).
2. **Live AI uplink** — best effort, auto-failover. Works for free when the
   page runs inside Claude (claude.ai artifact / app bridge). You can also
   point it at your own proxy with `set uplink <url>`.
3. **The paste pipeline** — the guaranteed free brain, works from GitHub Pages:
   1. Type `export` — the full panel state + protocol instructions are copied
      to your clipboard.
   2. Paste into any Claude chat and ask for anything ("rate my ECs harder",
      "build a UCAT prep panel", "make a Pokémon collection tab").
   3. Paste Claude's JSON reply back into the JARVIS input — the panel swoops
      in and persists.

## Commands

- Panel keywords — `today`, `uni apps`, `training`, `projects`, `stats`, `ecs`
- `add <thing> to <panel>` — append a row (`add FRC practice to my projects`)
- `update/set <row> <number>` or `I hit 125 on power clean` — change a value,
  units preserved, handled locally
- `close` / Esc — dismiss panels · `reset panels` — restore the six defaults
- `export` — copy the Claude briefing package · `diagnostics` — per-route uplink check
- `set uplink <url>` / `clear uplink` / `uplink status` — optional personal AI proxy
- Mic button for voice input (en-CA), speaker button toggles spoken replies

## Editing later (with any AI model or by hand)

Drop the repo (or just `index.html`) into a chat / Claude Code and describe the
change — `CLAUDE.md` has the context a model needs. The panel spec protocol is
documented there and inside the page's `export` payload.
