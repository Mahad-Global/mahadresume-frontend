import { useState, useRef, useEffect } from 'react'

const GEMINI_KEY = 'AIzaSyCtObr9ynCP0EocW7LT9S_MTs0dNap9Cy0'
const SYSTEM_PROMPT = 'You are Rex AI, MahadResume smart career assistant for UAE and Gulf job seekers. Help with resume writing, ATS tips, interview prep, and Gulf job market guidance. Be friendly, brief, max 3 sentences per reply. Always encourage using MahadResume features.'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hi! I am Rex AI 👋 Ask me anything about resumes, jobs, or career tips for UAE & Gulf market!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }))
      history.push({ role: 'user', parts: [{ text: userMsg }] })

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: history
          })
        }
      )
      const data = await res.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not get a response. Please try again.'
      setMessages(prev => [...prev, { role: 'model', text: reply }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, something went wrong. Please try again!' }])
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Chat Window */}
      {open && (
        <div style={{
          width: '360px', height: '500px', background: '#0D1B2A',
          borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', marginBottom: '12px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Header */}
          <div style={{
            background: '#1A73E8', padding: '14px 16px', borderRadius: '16px 16px 0 0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px' }}>🤖</span>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>Rex AI</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>MahadResume Career Assistant</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
              width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer',
              fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? '#1A73E8' : 'rgba(255,255,255,0.1)',
                  color: 'white', fontSize: '13px', lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '16px 16px 16px 4px',
                  background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '20px', letterSpacing: '4px'
                }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>•••</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px', borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', gap: '8px', alignItems: 'center'
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Rex anything..."
              style={{
                flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '20px', padding: '8px 14px', color: 'white', fontSize: '13px', outline: 'none'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? 'rgba(26,115,232,0.5)' : '#1A73E8',
                border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px'
              }}
            >➤</button>
          </div>
        </div>
      )}

      {/* Bubble Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #1A73E8, #0097A7)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(26,115,232,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '26px', transition: 'transform 0.2s', transform: open ? 'scale(0.9)' : 'scale(1)'
        }}
      >
        {open ? '×' : '🤖'}
      </button>
    </div>
  )
}