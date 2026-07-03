'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Sparkles, Send } from 'lucide-react'

type Msg = { role: 'user' | 'ai'; text: string }

const scripted: Record<string, string> = {
  'Can I afford a holiday this month?':
    "Yes — you have S$2,400 in flexible cashflow after bills and savings. A 4-day Japan trip fits within budget if you keep dining under S$300. Want me to set that guardrail?",
  'How much did I spend on dining?':
    "You spent S$340 on dining this month, 32% below your S$500 budget. Nice pace — you have S$160 left for the week.",
  'Am I on track to save?':
    "You're at 78% of your S$1,000 monthly savings goal with 9 days left. Auto-topping up S$60/week keeps you on track.",
  'Find me a better FX rate.':
    "SGD to JPY is 4% stronger than your 30-day average right now. I can lock today's rate for your Japan trip — shall I?",
}

const prompts = Object.keys(scripted)

export function VoiceAssistant() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: 'ai',
      text: "Hi Amelia, I'm your OCBC AI banker. Tap the mic or ask me anything about your money.",
    },
  ])
  const [listening, setListening] = useState(false)
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const ask = (text: string) => {
    if (!text.trim()) return
    const reply =
      scripted[text] ??
      'Let me analyse that. Based on your accounts, your cashflow looks healthy and you have room to act this week.'
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', text: reply }])
    }, 600)
  }

  const toggleMic = () => {
    setListening((l) => !l)
    if (!listening) {
      setTimeout(() => {
        setListening(false)
        ask('Can I afford a holiday this month?')
      }, 1800)
    }
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/voice-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/70"
      />

      <div className="relative flex h-full flex-col text-white">
        <header className="px-5 pt-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="font-heading text-base font-bold leading-tight">
                AI Assistant
              </p>
              <p className="text-[11px] text-white/70">Voice &amp; chat banking</p>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar px-5 py-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <p
                className={`max-w-[80%] text-pretty rounded-2xl px-4 py-2.5 text-sm leading-relaxed animate-view-in ${
                  m.role === 'user'
                    ? 'rounded-br-sm bg-primary text-primary-foreground'
                    : 'rounded-bl-sm bg-white/95 text-foreground backdrop-blur-sm'
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Prompt chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 pb-3">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => ask(p)}
              className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Mic + input */}
        <div className="flex items-center gap-3 px-5 pb-4">
          <div className="relative flex items-center justify-center">
            {listening && (
              <span className="absolute h-14 w-14 rounded-full bg-white/40 animate-pulse-ring" />
            )}
            <button
              onClick={toggleMic}
              aria-label="Activate voice input"
              className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors ${
                listening
                  ? 'bg-white text-primary'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              <Mic className="h-6 w-6" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              ask(input)
            }}
            className="flex flex-1 items-center gap-2 rounded-full bg-white/95 px-4 py-2.5 backdrop-blur-sm"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={listening ? 'Listening…' : 'Ask anything…'}
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="text-primary disabled:opacity-40"
              disabled={!input.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
