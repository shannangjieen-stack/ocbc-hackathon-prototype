'use client'

import Image from 'next/image'
import {
  Bell,
  Eye,
  QrCode,
  ArrowLeftRight,
  RefreshCcw,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react'
import type { ViewKey } from '../app-shell'
import {
  accounts,
  upcomingBills,
  categories,
  currency,
  currencyShort,
} from '@/lib/ocbc-data'

export function HomeDashboard({
  onNavigate,
}: {
  onNavigate: (v: ViewKey) => void
}) {
  const total = accounts.reduce((s, a) => s + a.balance, 0)

  return (
    <div className="animate-view-in space-y-5 px-5 pb-6 pt-2">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            AL
          </span>
          <div>
            <p className="text-xs text-muted-foreground">Good morning</p>
            <p className="font-heading text-base font-bold leading-tight text-foreground">
              Amelia Low
            </p>
          </div>
        </div>
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
        </button>
      </header>

      {/* Total balance card */}
      <section className="relative overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/25">
        <div
          aria-hidden
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"
        />
        <div
          aria-hidden
          className="absolute -bottom-16 -left-6 h-40 w-40 rounded-full bg-black/10"
        />
        <div className="relative flex items-center justify-between">
          <p className="text-xs font-medium text-primary-foreground/80">
            Total balance
          </p>
          <Eye className="h-4 w-4 text-primary-foreground/80" />
        </div>
        <p className="relative mt-1 font-heading text-3xl font-extrabold tracking-tight">
          {currency(total)}
        </p>
        <div className="relative mt-4 grid grid-cols-2 gap-3">
          {accounts.map((a) => (
            <div
              key={a.number}
              className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm"
            >
              <p className="text-[11px] text-primary-foreground/80">{a.name}</p>
              <p className="mt-0.5 text-sm font-bold">{currency(a.balance)}</p>
              <p className="text-[10px] text-primary-foreground/70">
                {a.number}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { label: 'PayNow', icon: QrCode },
          { label: 'Transfer', icon: ArrowLeftRight },
          { label: 'FX Convert', icon: RefreshCcw },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 transition-colors hover:bg-secondary"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Icon className="h-5 w-5 text-primary" />
            </span>
            <span className="text-xs font-semibold text-foreground">
              {label}
            </span>
          </button>
        ))}
      </section>

      {/* AI Insight card */}
      <button
        onClick={() => onNavigate('spending')}
        className="block w-full rounded-3xl border border-primary/15 bg-gradient-to-br from-accent to-card p-5 text-left transition-transform active:scale-[0.99]"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </span>
          <p className="text-sm font-bold text-foreground">AI Weekly Insight</p>
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            Live
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Based on your cashflow, you can comfortably spend{' '}
          <span className="font-bold text-foreground">
            {currencyShort(categories[0].aiAllowance)}
          </span>{' '}
          on dining,{' '}
          <span className="font-bold text-foreground">
            {currencyShort(320)}
          </span>{' '}
          on travel and{' '}
          <span className="font-bold text-foreground">
            {currencyShort(categories[2].aiAllowance)}
          </span>{' '}
          on shopping this week.
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          See spending breakdown <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </button>

      {/* Lifestyle carousel */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold text-foreground">
            For your lifestyle
          </h2>
          <button
            onClick={() => onNavigate('hub')}
            className="text-xs font-semibold text-primary"
          >
            View all
          </button>
        </div>
        <div className="-mx-5 flex gap-3 overflow-x-auto no-scrollbar px-5 pb-1">
          {categories.map((c) => (
            <article
              key={c.key}
              className="relative h-40 w-56 shrink-0 overflow-hidden rounded-3xl"
            >
              <Image
                src={c.image || '/placeholder.svg'}
                alt={c.label}
                fill
                sizes="224px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-[11px] font-medium text-white/80">
                  {c.label}
                </p>
                <p className="font-heading text-base font-bold leading-tight">
                  {currencyShort(c.budget - c.spent > 0 ? c.budget - c.spent : 0)}{' '}
                  left
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Upcoming bills */}
      <section className="rounded-3xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-sm font-bold text-foreground">
            Upcoming bills
          </h2>
          <span className="text-xs text-muted-foreground">
            {upcomingBills.length} due
          </span>
        </div>
        <ul className="space-y-3">
          {upcomingBills.map((b) => (
            <li key={b.name} className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                <Plus className="h-4 w-4 text-primary" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {b.name}
                </p>
                <p className="text-xs text-muted-foreground">{b.due}</p>
              </div>
              <span className="text-sm font-bold text-foreground">
                {currency(b.amount)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
