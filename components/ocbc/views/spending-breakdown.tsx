'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  UtensilsCrossed,
  Plane,
  ShoppingBag,
  AlertTriangle,
  Wand2,
  Check,
  TrendingDown,
} from 'lucide-react'
import { categories, currency } from '@/lib/ocbc-data'

const icons: Record<string, typeof Plane> = {
  dining: UtensilsCrossed,
  travel: Plane,
  shopping: ShoppingBag,
}

export function SpendingBreakdown() {
  const [recalibrated, setRecalibrated] = useState(false)
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0)
  const overBudget = categories.filter((c) => c.spent > c.budget)

  return (
    <div className="animate-view-in space-y-5 px-5 pb-6 pt-2">
      <header className="pt-2">
        <p className="text-xs font-medium text-primary">SPENDING · THIS MONTH</p>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
          Where your money went
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;ve spent{' '}
          <span className="font-bold text-foreground">
            {currency(totalSpent)}
          </span>{' '}
          across 3 categories.
        </p>
      </header>

      {/* Dynamic recalibration card */}
      {overBudget.length > 0 && (
        <section
          className={`overflow-hidden rounded-3xl border p-5 transition-colors ${
            recalibrated
              ? 'border-[var(--success)]/30 bg-[var(--success)]/8'
              : 'border-primary/20 bg-primary/8'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                recalibrated
                  ? 'bg-[var(--success)]/15 text-[var(--success)]'
                  : 'bg-primary/15 text-primary'
              }`}
            >
              {recalibrated ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </span>
            <p className="text-sm font-bold text-foreground">
              {recalibrated ? 'Budgets recalibrated' : 'AI recalibration needed'}
            </p>
          </div>

          {recalibrated ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Done. I&apos;ve trimmed{' '}
              <span className="font-semibold text-foreground">Dining</span> and{' '}
              <span className="font-semibold text-foreground">Shopping</span> by{' '}
              {currency(80)} combined to absorb your{' '}
              <span className="font-semibold text-foreground">Travel</span>{' '}
              overspend. You&apos;re back on track for the month.
            </p>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your <span className="font-semibold text-foreground">Travel</span>{' '}
              spend is{' '}
              <span className="font-semibold text-primary">
                {currency(overBudget[0].spent - overBudget[0].budget)} over
              </span>{' '}
              target. I can rebalance your other budgets to keep the month on
              plan.
            </p>
          )}

          {!recalibrated && (
            <button
              onClick={() => setRecalibrated(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
            >
              <Wand2 className="h-4 w-4" /> Apply AI recalibration
            </button>
          )}
        </section>
      )}

      {/* Category bars */}
      <section className="space-y-4">
        {categories.map((c, i) => {
          const Icon = icons[c.key]
          const over = c.spent > c.budget
          const adjustedBudget =
            recalibrated && !over ? Math.round(c.budget * 0.9) : c.budget
          const pct = Math.min((c.spent / adjustedBudget) * 100, 100)

          return (
            <article
              key={c.key}
              className="relative overflow-hidden rounded-3xl border border-border bg-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="relative h-24 w-full">
                <Image
                  src={c.image || '/placeholder.svg'}
                  alt={c.label}
                  fill
                  sizes="400px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
                <div className="absolute inset-0 flex items-center justify-between px-5">
                  <div className="flex items-center gap-3 text-white">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading text-base font-bold leading-tight">
                        {c.label}
                      </p>
                      <p className="text-xs text-white/80">
                        {currency(c.spent)} of {currency(adjustedBudget)}
                      </p>
                    </div>
                  </div>
                  {over ? (
                    <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">
                      Over
                    </span>
                  ) : recalibrated ? (
                    <span className="flex items-center gap-1 rounded-full bg-[var(--success)] px-2.5 py-1 text-[11px] font-bold text-[var(--success-foreground)]">
                      <TrendingDown className="h-3 w-3" /> Trimmed
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="px-5 py-4">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full animate-grow-x ${
                      over ? 'bg-primary' : 'bg-[var(--success)]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {Math.round(pct)}% used
                  </span>
                  <span
                    className={`font-semibold ${
                      over ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {over
                      ? `${currency(c.spent - adjustedBudget)} over`
                      : `${currency(adjustedBudget - c.spent)} left`}
                  </span>
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </div>
  )
}
