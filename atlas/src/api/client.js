// Single API client module — all persistence flows through here.
//
// Two backends, picked automatically:
//  - server: the Express API (npm run dev) — persists to data/*.json
//  - local:  browser localStorage, seeded from server/seed.js — used when
//    the app is served statically (e.g. GitHub Pages on a phone) and no
//    API is reachable. Data then lives on the device.
import { seed } from '../../server/seed'

const LS_PREFIX = 'atlas-data-v1-'

let modePromise = null
function getMode() {
  if (!modePromise) {
    modePromise = fetch('/api/chat/status', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? 'server' : 'local'))
      .catch(() => 'local')
  }
  return modePromise
}

async function request(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `${res.status} ${res.statusText}`)
  }
  return res.json()
}

function localGet(collection) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + collection)
    if (raw !== null) return JSON.parse(raw)
  } catch {
    /* corrupted entry — fall through to seed */
  }
  return structuredClone(seed[collection])
}

function localPut(collection, value) {
  localStorage.setItem(LS_PREFIX + collection, JSON.stringify(value))
  return { ok: true }
}

export const api = {
  get: async (collection) =>
    (await getMode()) === 'server'
      ? request(`/api/data/${collection}`)
      : localGet(collection),

  put: async (collection, value) =>
    (await getMode()) === 'server'
      ? request(`/api/data/${collection}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(value),
        })
      : localPut(collection, value),

  chatStatus: async () =>
    (await getMode()) === 'server'
      ? request('/api/chat/status')
      : { configured: false },

  chat: async (messages) => {
    if ((await getMode()) !== 'server') {
      throw new Error('Chat needs the local server (npm run dev)')
    }
    return request('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    })
  },
}
