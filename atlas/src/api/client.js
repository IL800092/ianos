// Single API client module — all persistence flows through here.

async function request(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `${res.status} ${res.statusText}`)
  }
  return res.json()
}

export const api = {
  get: (collection) => request(`/api/data/${collection}`),
  put: (collection, value) =>
    request(`/api/data/${collection}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    }),
  chatStatus: () => request('/api/chat/status'),
  chat: (messages) =>
    request('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    }),
}
