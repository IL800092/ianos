# ATLAS — Personal Command Center

A JARVIS-style dashboard for university applications, SAT prep, projects,
athletic training, and todos. React + Vite + Tailwind frontend, tiny Express
backend that persists everything to JSON files in `data/`.

## Run it

```bash
cd atlas
npm install
npm run dev
```

That's it — `npm run dev` starts **both** servers via `concurrently`:

- Web UI: **http://localhost:5173**
- API: http://localhost:5178 (proxied under `/api` by Vite)

## Data & persistence

Every form writes through the Express API to `data/*.json`. Refreshing never
loses data. On first boot the server seeds `data/` with starter content; on
later restarts existing files are **never overwritten**. To factory-reset,
delete the `data/` folder and restart.

Collections: `profile`, `academics`, `sat`, `university`, `projects`,
`training`, `todos` — each is a plain JSON file you can also edit by hand.

## ATLAS chat (optional)

The chat panel calls the Anthropic API **through the Express proxy**, so your
key never reaches the browser:

```bash
cp .env.example .env
# set ANTHROPIC_API_KEY=sk-ant-...
npm run dev
```

Without a key the panel shows a "connect your API key" state instead of
breaking. The chat's system prompt is rebuilt from your live data on every
message, so it answers with your actual deadlines, todos, and projects in
mind.

## Retheming

All design tokens (colors, fonts) live in `src/index.css` as CSS variables;
Tailwind reads them in `tailwind.config.js`. Change `--c-accent` to retheme
the whole app.

## Structure

```
server/           Express API + first-boot seeding
data/             Your data (gitignored, created on first run)
src/api/          Single fetch client
src/lib/          Date math + data hooks
src/components/   Layout + shared UI
src/features/     One folder per page (brief, academics, university,
                  projects, training, todos, chat)
```
