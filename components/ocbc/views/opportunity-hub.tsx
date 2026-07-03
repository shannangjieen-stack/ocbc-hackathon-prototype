'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Plane,
  ShieldCheck,
  RefreshCcw,
  ArrowRight,
  Check,
} from 'lucide-react'

const offers = [
  {
    key: 'fx',
    tag: 'FX Rate Alert',
    title: 'Convert SGD to JPY',
    desc: 'Rate is 4% better than your 30-day average.',
    image: '/images/currency.png',
    icon: RefreshCcw,
    cta: 'Lock rate',
  },
  {
    key: 'insurance',
    tag: 'Travel Cover',
    title: 'Add travel insurance',
    desc: 'From S$18 for your Tokyo trip, 6–14 Apr.',
    image: '/images/insurance.png',
    icon: ShieldCheck,
    cta: 'Get covered',
  },
  {
    key: 'miles',
    tag: 'Rewards',
    title: 'Boost your travel miles',
    desc: 'Earn 4x miles on overseas spend this month.',
    image: '/images/travel.png',
    icon: Plane,
    cta: 'Activate',
  },
]

export function OpportunityHub() {
  const [accepted, setAccepted] = useState(false)

  return (
    <div className="animate-view-in space-y-6 pb-6 pt-2">
      <header className="px-5 pt-2">
        <p className="text-xs font-medium text-primary">OPPORTUNITY HUB</p>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
          Timed for you
        </h1>
      </header>

      {/* Hero contextual AI banner */}
      <section className="relative mx-5 overflow-hidden rounded-3xl">
        <Image
          src="/images/travel.png"
          alt="Trip to Japan"
          width={800}
          height={500}
          className="h-56 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-white/85">
              AI spotted this
            </span>
          </div>
          <h2 className="font-heading text-xl font-extrabold leading-snug text-balance">
            You booked a flight to Japan
          </h2>
          <p className="mt-1 max-w-[17rem] text-sm text-white/85">
            Convert SGD to JPY at today&apos;s stronger rate and add travel
            insurance in one tap?
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setAccepted(true)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform active:scale-95 ${
                accepted
                  ? 'bg-[var(--success)] text-[var(--success-foreground)]'
                  : 'bg-primary text-primary-foreground'
              }`}
            >
              {accepted ? (
                <>
                  <Check className="h-4 w-4" /> Bundle added
                </>
              ) : (
                <>
                  Convert &amp; insure <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
            <button className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
              Later
            </button>
          </div>
        </div>
      </section>

      {/* Offer carousel */}
      <section>
        <div className="mb-3 flex items-center justify-between px-5">
          <h2 className="font-heading text-sm font-bold text-foreground">
            More smart moves
          </h2>
          <span className="text-xs text-muted-foreground">Swipe →</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-2">
          {offers.map((o) => {
            const Icon = o.icon
            return (
              <article
                key={o.key}
                className="w-64 shrink-0 overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
              >
                <div className="relative h-32 w-full">
                  <Image
                    src={o.image || '/placeholder.svg'}
                    alt={o.title}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-bold text-primary backdrop-blur-sm">
                    {o.tag}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
                      <Icon className="h-4 w-4 text-primary" />
                    </span>
                    <p className="font-heading text-sm font-bold text-foreground">
                      {o.title}
                    </p>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {o.desc}
                  </p>
                  <button className="mt-3 inline-flex w-full items-center justify-center gap-1 rounded-full border border-primary/30 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/5">
                    {o.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* Insight strip */}
      <section className="mx-5 rounded-3xl bg-foreground p-5 text-background">
        <p className="text-xs font-medium text-background/70">AI FORECAST</p>
        <p className="mt-1 text-sm leading-relaxed">
          Acting on these now could save you an estimated{' '}
          <span className="font-bold text-background">S$186</span> on your Japan
          trip.
        </p>
      </section>
    </div>
  )
}
