'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Mic, RotateCcw, Send, Sparkles, Wand2, ArrowRight } from 'lucide-react'
import { AVAILABLE_CASHFLOW, GOAL_TOTAL, JourneyState, clonePlan, currency, planValid, remainingGoal, resetPlan } from '@/lib/ocbc-journey'
import type { ViewKey } from '../app-shell'

type Props = { journey: JourneyState; onUpdate: (next: Partial<JourneyState>) => void; onNavigate?: (view: ViewKey) => void }
type Msg = { role: 'user' | 'ai'; text: string }
type DetailKey = 'destination' | 'budget' | 'timing' | 'style'

const detailQuestions: { key: DetailKey; prompt: string }[] = [
  { key: 'destination', prompt: 'Where are you thinking of going?' },
  { key: 'budget', prompt: 'What budget would feel comfortable for the trip?' },
  { key: 'timing', prompt: 'When would you like to go?' },
  { key: 'style', prompt: 'What kind of trip are you planning — relaxed, food-focused, or packed with activities?' },
]

export function VoiceAssistant({ journey, onUpdate, onNavigate }: Props) {
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: "Hi Amelia, I'm OCBC Pulse. Tell me what you're planning and I'll ask a few questions before building your money plan." }])
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const [editing, setEditing] = useState(false)
  const [details, setDetails] = useState<Partial<Record<DetailKey, string>>>({})
  const [detailIndex, setDetailIndex] = useState(-1)
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, analyzing, showPlan])

  const respond = (text: string) => setMessages((m) => [...m, { role: 'ai', text }])
  const ask = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    setMessages((m) => [...m, { role: 'user', text: clean }])
    setInput('')

    if (detailIndex >= 0 && detailIndex < detailQuestions.length) {
      const question = detailQuestions[detailIndex]
      const nextDetails = { ...details, [question.key]: clean }
      setDetails(nextDetails)
      const nextIndex = detailIndex + 1
      if (nextIndex < detailQuestions.length) {
        setDetailIndex(nextIndex)
        setTimeout(() => respond(detailQuestions[nextIndex].prompt), 350)
      } else {
        setDetailIndex(-1)
        setAnalyzing(true)
        setTimeout(() => {
          setAnalyzing(false)
          setShowPlan(true)
          respond(`Thanks — I have enough detail to build a plan for your ${nextDetails.timing || 'upcoming'} ${nextDetails.destination || 'Japan'} trip. I mapped a ${currency(GOAL_TOTAL)} goal while protecting your ${currency(AVAILABLE_CASHFLOW)} monthly cashflow.`)
        }, 850)
      }
      return
    }

    if (/japan|holiday|trip|travel/i.test(clean)) {
      setDetailIndex(0)
      setTimeout(() => respond(detailQuestions[0].prompt), 350)
    } else {
      setTimeout(() => respond('I can help plan a goal, but I need a few details first. Try saying “Plan a Japan trip” and I’ll ask about your destination, budget, timing, and travel style.'), 400)
    }
  }

  const updateMonth = (index: number, field: 'contribution' | 'dining' | 'shopping' | 'travel', value: number) => {
    const next = clonePlan(journey.plan)
    if (field === 'contribution') next[index].contribution = value
    else next[index].categories[field] = value
    onUpdate({ plan: next, status: 'draft' })
  }
  const approve = () => { if (planValid(journey.plan)) onUpdate({ status: 'approved', reportGenerated: true }) }
  const reset = () => { onUpdate({ plan: resetPlan(), status: 'draft', reportGenerated: false }); setShowPlan(false); setEditing(false); setDetails({}); setDetailIndex(-1); setMessages([{ role: 'ai', text: 'Plan reset. What would you like to work towards?' }]) }
  const valid = planValid(journey.plan)

  return <div className="relative flex h-full flex-col bg-[#3b0710] text-white"><div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-[#5c0b18] to-[#25040a]" /><div className="relative flex h-full flex-col"><header className="px-5 pt-3"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15"><Sparkles className="h-4 w-4" /></span><div><p className="font-heading text-base font-bold">OCBC Pulse</p><p className="text-[11px] text-white/70">Voice &amp; chat banking</p></div></div></header>
    <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 no-scrollbar">{messages.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[84%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-sm bg-primary' : 'rounded-bl-sm bg-white/95 text-foreground'}`}>{m.text}</p></div>)}{analyzing && <div className="flex items-center gap-2 text-sm text-white/80"><Wand2 className="h-4 w-4 animate-pulse" /> Analysing your answers and cashflow…</div>}
      {showPlan && <section className="rounded-3xl bg-white p-4 text-foreground shadow-xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-primary">Japan trip plan</p><p className="mt-1 font-heading text-lg font-bold">Save {currency(GOAL_TOTAL)} by December</p><p className="text-xs text-muted-foreground">{currency(remainingGoal(journey.plan))} remaining · {currency(AVAILABLE_CASHFLOW)} monthly cashflow</p></div><button onClick={() => setEditing(!editing)} className="rounded-full bg-secondary p-2" aria-label="Adjust plan"><ChevronDown className={`h-4 w-4 transition-transform ${editing ? 'rotate-180' : ''}`} /></button></div><div className="mt-3 space-y-2">{journey.plan.map((m, i) => <div key={m.month} className="rounded-2xl bg-secondary/60 p-3"><div className="flex items-center justify-between"><span className="text-sm font-bold">{m.month}</span>{editing ? <label className="flex items-center gap-1 text-xs">Save S$ <input type="number" min="0" value={m.contribution} onChange={(e) => updateMonth(i, 'contribution', Math.max(0, Number(e.target.value)))} className="w-16 rounded-lg border bg-card px-2 py-1 text-right" /></label> : <span className="text-sm font-semibold text-primary">{currency(m.contribution)}</span>}</div>{editing && <div className="mt-2 grid grid-cols-3 gap-2">{(['dining','shopping','travel'] as const).map((key) => <label key={key} className="text-[10px] text-muted-foreground">{key}<input type="number" min="0" value={m.categories[key]} onChange={(e) => updateMonth(i, key, Math.max(0, Number(e.target.value)))} className="mt-1 w-full rounded-lg border bg-card px-2 py-1 text-xs text-foreground" /></label>)}</div>}</div>)}</div>{!valid && <p className="mt-2 text-xs font-semibold text-primary">Category allocations exceed available monthly cashflow. Reduce a category before approving.</p>}<div className="mt-3 flex gap-2"><button onClick={() => setEditing(true)} className="flex-1 rounded-full border border-border py-2 text-xs font-semibold">Adjust plan</button><button disabled={!valid} onClick={approve} className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40">{journey.status === 'approved' ? 'Approved' : 'Approve plan'}</button></div>{journey.status === 'approved' && <button onClick={() => onNavigate?.('report')} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-2.5 text-xs font-semibold text-background"><Check className="h-4 w-4" /> View your Financial Report <ArrowRight className="h-4 w-4" /></button>}<button onClick={reset} className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-muted-foreground"><RotateCcw className="h-3 w-3" /> Reset journey</button></section>}<div ref={endRef} /></div>
    <div className="flex gap-2 overflow-x-auto px-5 pb-3 no-scrollbar">{['Plan a Japan trip', 'How does this affect my cashflow?', 'Adjust my monthly contribution'].map((p) => <button key={p} onClick={() => ask(p)} className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs">{p}</button>)}</div><div className="flex items-center gap-3 px-5 pb-4"><button onClick={() => ask('Plan a Japan trip')} aria-label="Activate voice input" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"><Mic className="h-6 w-6" /></button><form onSubmit={(e) => { e.preventDefault(); if (!e.nativeEvent.isComposing && (e as unknown as KeyboardEvent).keyCode !== 229) ask(input) }} className="flex flex-1 items-center gap-2 rounded-full bg-white/95 px-4 py-2.5"><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything…" className="flex-1 bg-transparent text-sm text-foreground outline-none" /><button type="submit" aria-label="Send message" disabled={!input.trim()} className="text-primary disabled:opacity-40"><Send className="h-5 w-5" /></button></form></div></div></div>
}
