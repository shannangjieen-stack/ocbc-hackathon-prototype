'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Mic, RotateCcw, Send, Sparkles, Wand2 } from 'lucide-react'
import { AVAILABLE_CASHFLOW, GOAL_TOTAL, JourneyState, MonthPlan, clonePlan, currency, exportPlanText, planValid, remainingGoal, totalContribution } from '@/lib/ocbc-journey'

type Props = { journey: JourneyState; onUpdate: (next: Partial<JourneyState>) => void }
type Msg = { role: 'user' | 'ai'; text: string }

export function VoiceAssistant({ journey, onUpdate }: Props) {
  const [messages, setMessages] = useState<Msg[]>([{ role: 'ai', text: "Hi Amelia, I'm OCBC Pulse. Tell me what you're planning and I'll turn it into a money plan." }])
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [showPlan, setShowPlan] = useState(false)
  const [editing, setEditing] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, analyzing])

  const ask = (text: string) => {
    if (!text.trim()) return
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    if (/japan|holiday|trip|travel/i.test(text)) {
      setAnalyzing(true)
      setTimeout(() => { setAnalyzing(false); setShowPlan(true); setMessages((m) => [...m, { role: 'ai', text: `I mapped a ${currency(GOAL_TOTAL)} Japan trip across September to December. Your contributions total ${currency(totalContribution(journey.plan))}, leaving ${currency(remainingGoal(journey.plan))} to refine.` }]) }, 900)
    } else {
      setTimeout(() => setMessages((m) => [...m, { role: 'ai', text: 'I can help you plan a goal, adjust your monthly contribution, or explain how each spending category affects your cashflow.' }]), 500)
    }
  }

  const updateMonth = (index: number, field: 'contribution' | 'dining' | 'shopping' | 'travel', value: number) => {
    const next = clonePlan(journey.plan)
    if (field === 'contribution') next[index].contribution = value
    else next[index].categories[field] = value
    onUpdate({ plan: next, status: 'draft' })
  }

  const reset = () => {
    const defaults = [
      { month: 'Sep', contribution: 700, categories: { dining: 420, shopping: 380, travel: 200 } },
      { month: 'Oct', contribution: 850, categories: { dining: 400, shopping: 350, travel: 180 } },
      { month: 'Nov', contribution: 950, categories: { dining: 390, shopping: 330, travel: 160 } },
      { month: 'Dec', contribution: 700, categories: { dining: 450, shopping: 400, travel: 220 } },
    ]
    onUpdate({ plan: defaults, status: 'draft' })
    setShowPlan(false)
    setEditing(false)
    setMessages([{ role: 'ai', text: 'Plan reset. What would you like to work towards?' }])
  }
  const valid = planValid(journey.plan)

  return <div className="relative flex h-full flex-col bg-[#3b0710] text-white"><div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-[#5c0b18] to-[#25040a]" />
    <div className="relative flex h-full flex-col"><header className="px-5 pt-3"><div className="flex items-center gap-2"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15"><Sparkles className="h-4 w-4" /></span><div><p className="font-heading text-base font-bold">OCBC Pulse</p><p className="text-[11px] text-white/70">Voice &amp; chat banking</p></div></div></header>
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4 no-scrollbar">{messages.map((m, i) => <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[84%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-sm bg-primary' : 'rounded-bl-sm bg-white/95 text-foreground'}`}>{m.text}</p></div>)}
        {analyzing && <div className="flex items-center gap-2 text-sm text-white/80"><Wand2 className="h-4 w-4 animate-pulse" /> Analysing your cashflow and trip goal…</div>}
        {showPlan && <section className="rounded-3xl bg-white p-4 text-foreground shadow-xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-primary">Japan trip plan</p><p className="mt-1 font-heading text-lg font-bold">Save {currency(GOAL_TOTAL)} by December</p><p className="text-xs text-muted-foreground">{currency(remainingGoal(journey.plan))} remaining · {currency(AVAILABLE_CASHFLOW)} monthly cashflow</p></div><button onClick={() => setEditing(!editing)} className="rounded-full bg-secondary p-2" aria-label="Adjust plan"><ChevronDown className={`h-4 w-4 transition-transform ${editing ? 'rotate-180' : ''}`} /></button></div>
          <div className="mt-3 space-y-2">{journey.plan.map((m, i) => <div key={m.month} className="rounded-2xl bg-secondary/60 p-3"><div className="flex items-center justify-between"><span className="text-sm font-bold">{m.month}</span>{editing ? <label className="flex items-center gap-1 text-xs">Save S$ <input type="number" min="0" value={m.contribution} onChange={(e) => updateMonth(i, 'contribution', Math.max(0, Number(e.target.value)))} className="w-16 rounded-lg border bg-card px-2 py-1 text-right" /></label> : <span className="text-sm font-semibold text-primary">{currency(m.contribution)}</span>}</div>{editing && <div className="mt-2 grid grid-cols-3 gap-2">{(['dining','shopping','travel'] as const).map((key) => <label key={key} className="text-[10px] text-muted-foreground">{key}<input type="number" min="0" value={m.categories[key]} onChange={(e) => updateMonth(i, key, Math.max(0, Number(e.target.value)))} className="mt-1 w-full rounded-lg border bg-card px-2 py-1 text-xs text-foreground" /></label>)}</div>}</div>)}</div>
          {!valid && <p className="mt-2 text-xs font-semibold text-primary">Category allocations exceed available monthly cashflow. Reduce a category before approving.</p>}
          <div className="mt-3 flex gap-2"><button onClick={() => setEditing(true)} className="flex-1 rounded-full border border-border py-2 text-xs font-semibold">Adjust plan</button><button disabled={!valid} onClick={() => onUpdate({ status: 'approved' })} className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground disabled:opacity-40">{journey.status === 'approved' ? 'Approved' : 'Approve plan'}</button></div>
          <button onClick={reset} className="mt-3 flex w-full items-center justify-center gap-1 text-xs text-muted-foreground"><RotateCcw className="h-3 w-3" /> Reset journey</button>
        </section>}
        <div ref={endRef} /></div>
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 no-scrollbar">{['Plan a Japan trip for S$3,200','How does this affect my cashflow?','Adjust my monthly contribution'].map((p) => <button key={p} onClick={() => ask(p)} className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs">{p}</button>)}</div>
      <div className="flex items-center gap-3 px-5 pb-4"><button onClick={() => ask('Plan a Japan trip for S$3,200')} aria-label="Activate voice input" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"><Mic className="h-6 w-6" /></button><form onSubmit={(e) => { e.preventDefault(); ask(input) }} className="flex flex-1 items-center gap-2 rounded-full bg-white/95 px-4 py-2.5"><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything…" className="flex-1 bg-transparent text-sm text-foreground outline-none" /><button type="submit" aria-label="Send message" disabled={!input.trim()} className="text-primary disabled:opacity-40"><Send className="h-5 w-5" /></button></form></div>
    </div></div>
}
