import { useEffect, useRef, useState } from 'react'
import { KeyRound, Send, Sparkles } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { api } from '../../api/client'

function NoKeyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="rounded-full border border-accent/30 bg-accent/10 p-4">
        <KeyRound size={24} className="text-accent" />
      </div>
      <p className="font-display text-lg text-ink">Connect your API key</p>
      <p className="text-sm text-dim max-w-sm leading-relaxed">
        ATLAS chat runs through the local server so your key never touches the
        browser. Copy <code className="font-mono text-accent/90">.env.example</code>{' '}
        to <code className="font-mono text-accent/90">.env</code>, set{' '}
        <code className="font-mono text-accent/90">ANTHROPIC_API_KEY</code>, and
        restart <code className="font-mono text-accent/90">npm run dev</code>.
      </p>
      <p className="text-xs text-dim/60 max-w-sm">
        On the hosted/phone version there's no server to hold a key, so chat
        stays offline — everything else works and saves to this device.
      </p>
    </div>
  )
}

export function ChatPanel() {
  const [configured, setConfigured] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    api
      .chatStatus()
      .then((s) => setConfigured(s.configured))
      .catch(() => setConfigured(false))
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, busy])

  const send = async (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setBusy(true)
    try {
      const { reply } = await api.chat(next)
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages([
        ...next,
        { role: 'assistant', content: `⚠ Uplink error: ${err.message}` },
      ])
    } finally {
      setBusy(false)
    }
  }

  if (configured === null) return null
  if (!configured) {
    return (
      <Card title="ATLAS uplink">
        <NoKeyState />
      </Card>
    )
  }

  return (
    <Card title="ATLAS uplink" className="flex flex-col h-[70vh]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <Sparkles size={22} className="text-accent/60" />
            <p className="text-sm text-dim max-w-xs">
              ATLAS knows your deadlines, todos, and projects. Try{' '}
              <em>"what should I work on this week?"</em>
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
              m.role === 'user'
                ? 'ml-auto bg-accent/15 border border-accent/25 text-ink'
                : 'mr-auto bg-raised border hairline text-ink'
            }`}
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="mr-auto bg-raised border hairline rounded-xl px-3.5 py-2.5 text-sm text-dim font-mono animate-pulse">
            thinking…
          </div>
        )}
      </div>
      <form onSubmit={send} className="flex gap-2 mt-3 pt-3 border-t hairline">
        <input
          className="flex-1"
          placeholder="Ask ATLAS…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-lg border border-accent/40 bg-accent/10 text-accent px-3.5 disabled:opacity-40 hover:bg-accent/20 transition-colors"
        >
          <Send size={16} />
        </button>
      </form>
    </Card>
  )
}
