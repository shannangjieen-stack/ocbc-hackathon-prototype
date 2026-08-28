'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Plane,
  RefreshCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

type OpportunityHubProps = { onNavigate?: (view: 'hub' | 'report') => void }

type PreferenceKey = 'categories' | 'pulse' | 'products' | 'guidance'

const baseOpportunities = [
  {
    key: 'insurance',
    tag: 'May be useful',
    title: 'Travel insurance',
    desc: 'Protect an upcoming trip against selected disruptions, medical emergencies and other covered events.',
    image: '/images/insurance.png',
    icon: ShieldCheck,
    reason: 'Based on a broad spending category',
  },
  {
    key: 'overseas',
    tag: 'You may want to explore',
    title: 'Overseas card protection',
    desc: 'Review overseas card settings and learn how OCBC helps protect international transactions.',
    image: '/images/travel.png',
    icon: ShieldCheck,
    reason: 'Based on a broad spending category',
  },
  {
    key: 'fx',
    tag: 'May be useful',
    title: 'Foreign currency planning',
    desc: 'Explore ways to prepare for possible overseas spending and currency conversion.',
    image: '/images/currency.png',
    icon: RefreshCcw,
    reason: 'Based on a broad spending category',
  },
  {
    key: 'budget',
    tag: 'Optional support',
    title: 'Travel budget support',
    desc: 'Create a travel budget without sharing your itinerary.',
    image: '/images/goals.png',
    icon: Plane,
    reason: 'Based on a broad spending category',
  },
]

export function OpportunityHub({ onNavigate }: OpportunityHubProps) {
  const [hidden, setHidden] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [explored, setExplored] = useState<string | null>(null)
  const [preferences, setPreferences] = useState<Record<PreferenceKey, boolean>>({
    categories: true,
    pulse: true,
    products: true,
    guidance: false,
  })

  const togglePreference = (key: PreferenceKey) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }))
  }

  if (hidden) {
    return (
      <div className="animate-view-in space-y-5 px-5 pb-6 pt-4">
        <header>
          <p className="text-xs font-medium text-primary">OPPORTUNITY HUB</p>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight">Your choices come first</h1>
        </header>
        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success"><Check className="h-5 w-5" /></div>
          <h2 className="mt-4 font-heading text-lg font-bold">Travel suggestions are hidden</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Pulse will stop showing travel opportunities for this session. You can change this choice any time in Recommendation Preferences.</p>
          <button onClick={() => setHidden(false)} className="mt-4 rounded-full border border-primary/30 px-4 py-2 text-sm font-semibold text-primary">Show suggestions again</button>
        </section>
        <PreferencePanel open={showPreferences} onToggle={() => setShowPreferences(!showPreferences)} preferences={preferences} onPreferenceToggle={togglePreference} />
      </div>
    )
  }

  return (
    <div className="animate-view-in space-y-5 pb-6 pt-2">
      <header className="px-5 pt-2">
        <p className="text-xs font-medium text-primary">OPPORTUNITY HUB</p>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Possible next steps</h1>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Optional ideas based on information you choose to share.</p>
      </header>

      <section className="mx-5 overflow-hidden rounded-3xl border border-primary/15 bg-accent">
        <div className="relative h-44">
          <Image src="/images/travel.png" alt="A calm travel scene" fill sizes="380px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-background">
            <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary"><Sparkles className="h-3.5 w-3.5 text-primary-foreground" /></span><span className="text-[11px] font-semibold uppercase tracking-wide text-background/85">Privacy-safe signal</span></div>
            <h2 className="mt-2 font-heading text-xl font-extrabold leading-snug">Possible travel-related spending</h2>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">Pulse noticed a recent travel-related transaction. Would you like to explore support that may be useful for an upcoming trip?</p>
          <div className="mt-3 rounded-2xl border border-border/70 bg-card/70 p-3 text-xs text-muted-foreground"><b className="text-foreground">Transaction signal:</b> Trip.com · S$1,240 · Travel · Card payment</div>
          <button onClick={() => setShowWhy(!showWhy)} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary"><CircleHelp className="h-3.5 w-3.5" /> Why am I seeing this? {showWhy ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}</button>
          {showWhy && <div className="mt-3 space-y-2 rounded-2xl bg-card p-3 text-xs leading-relaxed text-muted-foreground"><p>You recently made a transaction with a merchant categorised as travel-related. Pulse does not receive your flight destination, itinerary or passenger details from this transaction.</p><p>Recommendations are based on broad transaction categories and information you choose to share.</p></div>}
          <div className="mt-4 flex gap-2"><button onClick={() => setExplored('travel')} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">Explore <ArrowRight className="h-4 w-4" /></button><button onClick={() => setHidden(true)} className="rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground">Not interested</button></div>
          {explored === 'travel' && <p className="mt-3 text-xs font-semibold text-success">You can review these optional suggestions below. Nothing is activated automatically.</p>}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between px-5"><h2 className="font-heading text-sm font-bold text-foreground">You may want to explore</h2><span className="text-xs text-muted-foreground">Swipe →</span></div>
        <div className="flex gap-4 overflow-x-auto px-5 pb-2 no-scrollbar">{baseOpportunities.map((o) => { const Icon = o.icon; return <article key={o.key} className="w-64 shrink-0 overflow-hidden rounded-3xl border border-border bg-card shadow-sm"><div className="relative h-32"><Image src={o.image} alt="" fill sizes="256px" className="object-cover" /><span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-bold text-primary backdrop-blur-sm">{o.tag}</span></div><div className="p-4"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent"><Icon className="h-4 w-4 text-primary" /></span><p className="font-heading text-sm font-bold text-foreground">{o.title}</p></div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{o.desc}</p><p className="mt-3 text-[10px] font-semibold text-primary">{o.reason}</p><button onClick={() => setExplored(o.key)} className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full border border-primary/30 py-2 text-xs font-semibold text-primary">{explored === o.key ? 'Added to review' : 'Explore'} <ArrowRight className="h-3.5 w-3.5" /></button></div></article> })}</div>
      </section>

      <section className="mx-5 rounded-3xl border border-border bg-card p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-medium text-muted-foreground">CUSTOMER CONTROL</p><p className="mt-1 font-heading font-bold">Recommendation Preferences</p></div><Settings2 className="h-5 w-5 text-primary" /></div><button onClick={() => setShowPreferences(!showPreferences)} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">{showPreferences ? 'Hide preferences' : 'Manage preferences'} {showPreferences ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</button>{showPreferences && <PreferencePanel open onToggle={() => setShowPreferences(false)} preferences={preferences} onPreferenceToggle={togglePreference} />}</section>

      <section className="mx-5 rounded-3xl bg-foreground p-5 text-background"><p className="text-xs font-medium text-background/70">HOW THIS WORKS</p><p className="mt-1 text-sm leading-relaxed">Suggestions are optional and broad. Pulse does not know your destination, itinerary, booking details, or passenger information from a bank transaction.</p>{onNavigate && <button onClick={() => onNavigate('report')} className="mt-3 text-xs font-semibold text-background underline underline-offset-4">See how recommendations appear in your Financial Report</button>}</section>
    </div>
  )
}

function PreferencePanel({ open, onToggle, preferences, onPreferenceToggle }: { open: boolean; onToggle: () => void; preferences: Record<PreferenceKey, boolean>; onPreferenceToggle: (key: PreferenceKey) => void }) {
  if (!open) return null
  const rows: { key: PreferenceKey; label: string }[] = [
    { key: 'categories', label: 'Use broad transaction categories' },
    { key: 'pulse', label: 'Use information shared with Pulse Assistant' },
    { key: 'products', label: 'Show product recommendations' },
    { key: 'guidance', label: 'Show financial guidance only' },
  ]
  return <div className="mt-4 space-y-2 border-t border-border pt-4">{rows.map((row) => <div key={row.key} className="flex items-center justify-between gap-3"><span className="text-xs leading-relaxed text-muted-foreground">{row.label}</span><button onClick={() => onPreferenceToggle(row.key)} aria-label={`${row.label}: ${preferences[row.key] ? 'on' : 'off'}`} aria-pressed={preferences[row.key]} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${preferences[row.key] ? 'bg-primary' : 'bg-secondary'}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-card transition-transform ${preferences[row.key] ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>)}</div>
}

