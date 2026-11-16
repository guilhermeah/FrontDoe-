import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { ChatService } from '../../services/ChatService'

interface Message {
  role: 'user' | 'bot'
  text: string
}

const INITIAL_MESSAGE: Message = {
  role: 'bot',
  text: 'Olá! Sou o DoaBot 🤖 Posso te ajudar com suas doações e campanhas. Como posso ajudar?',
}

export function ChatWidget() {
  const { user } = useAuth()
  const { isDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text }])

    if (!user || user.role !== 'DOADOR') {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: 'Para usar o DoaBot, faça login com uma conta de doador. 😊' },
      ])
      return
    }

    setLoading(true)
    try {
      const resposta = await ChatService.enviar(user.id, text)
      setMessages(prev => [...prev, { role: 'bot', text: resposta }])
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Desculpe, não consegui responder agora. Tente novamente.' }])
    } finally {
      setLoading(false)
    }
  }

  const bg = isDark ? '#1a1a2e' : '#ffffff'
  const userBubble = '#6c63ff'
  const botBubble = isDark ? '#2d2d44' : '#f3f4f6'
  const botText = isDark ? '#e5e7eb' : '#1f2937'
  const border = isDark ? 'rgba(108,99,255,0.3)' : '#e5e7eb'

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(108,99,255,0.5)',
          cursor: 'pointer',
          zIndex: 1050,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          color: '#fff',
          transition: 'transform 0.2s',
        }}
        title="DoaBot — Assistente de doações"
      >
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 92,
            right: 24,
            width: 340,
            maxHeight: 480,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            border: `1px solid ${border}`,
            zIndex: 1050,
            background: bg,
          }}
        >
          <div
            style={{
              background: '#6c63ff',
              padding: '12px 16px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>🤖</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>DoaBot</div>
              <div style={{ fontSize: 11, opacity: 0.85 }}>Assistente de doações</div>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 12px 4px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              maxHeight: 320,
            }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '8px 12px',
                    borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: m.role === 'user' ? userBubble : botBubble,
                    color: m.role === 'user' ? '#fff' : botText,
                    fontSize: 13,
                    lineHeight: 1.45,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '8px 14px', borderRadius: '12px 12px 12px 2px', background: botBubble, color: botText, fontSize: 12, opacity: 0.8 }}>
                  Pensando... ⏳
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '8px 10px', borderTop: `1px solid ${border}`, display: 'flex', gap: 6, background: bg }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Pergunte sobre suas doações..."
              disabled={loading}
              style={{
                flex: 1,
                border: `1px solid ${border}`,
                borderRadius: 8,
                padding: '7px 10px',
                fontSize: 13,
                outline: 'none',
                background: isDark ? '#2d2d44' : '#f9fafb',
                color: isDark ? '#e5e7eb' : '#1f2937',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                border: 'none',
                borderRadius: 8,
                padding: '7px 12px',
                color: '#fff',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !input.trim() ? 0.6 : 1,
                fontSize: 16,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
