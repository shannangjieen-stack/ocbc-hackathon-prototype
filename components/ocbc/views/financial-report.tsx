'use client'

import Image from 'next/image'
import {
  Share2,
  Download,
  Sparkles,
  Trophy,
  Target,
  PiggyBank,
  TrendingUp,
  Check,
  Flag,
} from 'lucide-react'

const bars = [
  { m: 'Nov', v: 52 },
  { m: 'Dec', v: 74 },
  { m: 'Jan', v: 61 },
  { m: 'Feb', v: 48 },
  { m: 'Mar', v: 83 },
  { m: 'Apr', v: 67 },
]

const goals = [
  {
    title: 'Emergency Fund',
    status: 'Achieved',
    achieved: true,
    icon: Trophy,
    detail: 'S$10,000 · 100%',
  },
  {
    title: 'Japan Trip Fund',
    status: 'In Progress',
    achieved: false,
    icon: Target,
    detail: 'S$3,200 of S$4,000 · 80%',
  },
  {
    title: 'New Home Deposit',
    status: 'In Progress',
    achieved: false,
    icon: Flag,
    detail: 'S$18k of S$60k · 30%',
  },
]

const milestones = [
  { icon: PiggyBank, label: 'Saved S$4.2k', sub: 'Best month yet' },
  { icon: TrendingUp, label: 'Net worth +8%', sub: 'vs last quarter' },
  { icon: Check, label: '6 bills on time', sub: 'No late fees' },
]

export function FinancialReport() {
  const maxV = Math.max(...bars.map((b) => b.v))

  return (
    <div className="animate-view-in space-y-6 pb-6 pt-2">
      <header className="flex items-start justify-between px-5 pt-2">
        <div>
          <p className="text-xs font-medium text-primary">FINANCIAL REPORT</p>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            April summary
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Share report"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            aria-label="Export report"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Goals carousel banner */}
      <section>
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-5 pb-1">
          {goals.map((g) => {
            const Icon = g.icon
            return (
              <article
                key={g.title}
                className="relative w-64 shrink-0 overflow-hidden rounded-3xl"
              >
                <Image
                  src="/images/goals.png"
                  alt=""
                  fill
                  sizes="256px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/25" />
                <div className="relative flex h-40 flex-col justify-between p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        g.achieved
                          ? 'bg-[var(--success)] text-[var(--success-foreground)]'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>
                  <div>
                    <p className="font-heading text-base font-bold">{g.title}</p>
                    <p className="text-xs text-white/80">{g.detail}</p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* AI summary */}
      <section className="mx-5 rounded-3xl border border-primary/15 bg-accent p-5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </span>
          <p className="text-sm font-bold text-foreground">AI Summary</p>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          April was a strong month. You saved{' '}
          <span className="font-bold text-foreground">S$4,200</span> — 18% more
          than your average — and stayed under budget in 2 of 3 categories.
          Travel overspend was offset automatically. Keep this pace and
          you&apos;ll hit your Japan goal by June.
        </p>
      </section>

      {/* Spending chart */}
      <section className="mx-5 rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <p className="font-heading text-sm font-bold text-foreground">
            Monthly spending
          </p>
          <span className="text-xs text-muted-foreground">6 months</span>
        </div>
        <div className="mt-5 flex h-36 items-end justify-between gap-2">
          {bars.map((b) => {
            const isPeak = b.v === maxV
            return (
              <div
                key={b.m}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="flex h-28 w-full items-end">
                  <div
                    className={`w-full rounded-t-lg animate-grow-x ${
                      isPeak ? 'bg-primary' : 'bg-primary/25'
                    }`}
                    style={{ height: `${(b.v / maxV) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {b.m}
                </span>
              </div>
            )
          })}
        </div>
      </section>

      {/* Savings ring + milestones */}
      <section className="mx-5 grid grid-cols-[auto_1fr] items-center gap-5 rounded-3xl border border-border bg-card p-5">
        <SavingsRing pct={78} />
        <div className="space-y-3">
          {milestones.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                  <Icon className="h-4 w-4 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {m.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="px-5">
        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]">
          <Download className="h-4 w-4" /> Export full report (PDF)
        </button>
      </div>
    </div>
  )
}

function SavingsRing({ pct }: { pct: number }) {
  const r = 34
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--secondary)"
          strokeWidth="8"
        />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-lg font-extrabold text-foreground">
          {pct}%
        </span>
        <span className="text-[10px] text-muted-foreground">Savings goal</span>
      </div>
    </div>
  )
}
