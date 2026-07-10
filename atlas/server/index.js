import 'dotenv/config'
import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { seed } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'data')
const PORT = process.env.ATLAS_API_PORT || 5178

const COLLECTIONS = [
  'profile',
  'academics',
  'sat',
  'university',
  'projects',
  'training',
  'todos',
]

// Seed only what's missing — never overwrite existing data on restart.
fs.mkdirSync(DATA_DIR, { recursive: true })
for (const name of COLLECTIONS) {
  const file = path.join(DATA_DIR, `${name}.json`)
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(seed[name], null, 2))
    console.log(`[atlas] seeded data/${name}.json`)
  }
}

const readCollection = (name) =>
  JSON.parse(fs.readFileSync(path.join(DATA_DIR, `${name}.json`), 'utf8'))

const writeCollection = (name, value) => {
  const file = path.join(DATA_DIR, `${name}.json`)
  const tmp = `${file}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2))
  fs.renameSync(tmp, file)
}

const app = express()
app.use(express.json({ limit: '1mb' }))

app.param('collection', (req, res, next, name) => {
  if (!COLLECTIONS.includes(name)) {
    return res.status(404).json({ error: `Unknown collection: ${name}` })
  }
  next()
})

app.get('/api/data/:collection', (req, res) => {
  res.json(readCollection(req.params.collection))
})

app.put('/api/data/:collection', (req, res) => {
  if (req.body === undefined || req.body === null) {
    return res.status(400).json({ error: 'Missing JSON body' })
  }
  writeCollection(req.params.collection, req.body)
  res.json({ ok: true })
})

// ---- ATLAS chat: Anthropic proxy ------------------------------------------

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY

app.get('/api/chat/status', (req, res) => {
  res.json({ configured: Boolean(apiKey) })
})

function buildSystemPrompt() {
  const today = new Date().toISOString().slice(0, 10)
  const ctx = {}
  for (const name of COLLECTIONS) {
    try {
      ctx[name] = readCollection(name)
    } catch {
      ctx[name] = null
    }
  }
  return [
    'You are ATLAS, the personal command-center assistant for Ian — a Grade 12 student at Bayview Glen (Toronto) applying to university for Fall 2027 entry.',
    'Answer like a sharp, warm chief-of-staff: concrete, brief, aware of his deadlines and workload. When asked what to focus on, reason from due dates and priorities.',
    `Today's date is ${today}.`,
    'Current dashboard data (JSON):',
    JSON.stringify(ctx),
  ].join('\n\n')
}

app.post('/api/chat', async (req, res) => {
  if (!apiKey) {
    return res.status(503).json({ error: 'No API key configured' })
  }
  const { messages } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' })
  }
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey })
    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      system: buildSystemPrompt(),
      messages: messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: String(m.content ?? ''),
      })),
    })
    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
    if (response.stop_reason === 'refusal' || !text) {
      return res.json({ reply: "I can't help with that one." })
    }
    res.json({ reply: text })
  } catch (err) {
    console.error('[atlas] chat error:', err?.message || err)
    const status = err?.status && err.status >= 400 ? err.status : 502
    res.status(status).json({ error: err?.message || 'Upstream error' })
  }
})

app.listen(PORT, () => {
  console.log(`[atlas] API listening on http://localhost:${PORT}`)
})
