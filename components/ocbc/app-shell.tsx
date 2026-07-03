'use client'

import { useState } from 'react'
import { StatusBar } from './status-bar'
import { BottomNav } from './bottom-nav'
import { HomeDashboard } from './views/home-dashboard'
import { SpendingBreakdown } from './views/spending-breakdown'
import { OpportunityHub } from './views/opportunity-hub'
import { VoiceAssistant } from './views/voice-assistant'
import { FinancialReport } from './views/financial-report'

export type ViewKey = 'home' | 'spending' | 'hub' | 'assistant' | 'report'

export function AppShell() {
  const [view, setView] = useState<ViewKey>('home')

  const darkStatus = view === 'assistant'

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-secondary via-background to-accent/40 px-0 py-0 sm:px-6 sm:py-10">
      {/* Ambient brand glow (desktop only) */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 hidden sm:block"
        style={{
          background:
            'radial-gradient(60rem 40rem at 80% -10%, oklch(0.565 0.238 25.5 / 0.10), transparent 60%)',
        }}
      />

      <div className="relative flex w-full max-w-[420px] flex-col">
        <BrandCaption view={view} />

        {/* Phone frame */}
        <div className="relative mx-auto flex h-[100dvh] w-full flex-col overflow-hidden bg-card shadow-2xl shadow-black/20 sm:h-[860px] sm:rounded-[2.75rem] sm:border-8 sm:border-foreground/90">
          {/* notch (desktop) */}
          <div className="pointer-events-none absolute left-1/2 top-0 z-30 hidden h-6 w-36 -translate-x-1/2 rounded-b-2xl bg-foreground/90 sm:block" />

          <StatusBar dark={darkStatus} />

          <div className="relative flex-1 overflow-y-auto no-scrollbar">
            {view === 'home' && <HomeDashboard onNavigate={setView} />}
            {view === 'spending' && <SpendingBreakdown />}
            {view === 'hub' && <OpportunityHub />}
            {view === 'assistant' && <VoiceAssistant />}
            {view === 'report' && <FinancialReport />}
          </div>

          <BottomNav active={view} onChange={setView} />
        </div>
      </div>
    </main>
  )
}

const captions: Record<ViewKey, string> = {
  home: 'Your money, understood in one glance.',
  spending: 'AI recalibrates your budgets as life happens.',
  hub: 'Timely, contextual moves — before you ask.',
  assistant: 'Just ask. Your AI banker is listening.',
  report: 'A story of progress, generated for you.',
}

function BrandCaption({ view }: { view: ViewKey }) {
  return (
    <div className="mb-6 hidden text-center sm:block">
      <div className="flex items-center justify-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-[13px] font-bold text-primary-foreground">
          O
        </span>
        <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
          OCBC <span className="text-primary">AI</span>
        </span>
      </div>
      <p
        key={view}
        className="mx-auto mt-2 max-w-xs text-pretty text-sm text-muted-foreground animate-view-in"
      >
        {captions[view]}
      </p>
    </div>
  )
}
