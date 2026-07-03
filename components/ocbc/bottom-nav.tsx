'use client'

import { Home, PieChart, Sparkles, Mic, FileText } from 'lucide-react'
import type { ViewKey } from './app-shell'

const items: { key: ViewKey; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'spending', label: 'Spending', icon: PieChart },
  { key: 'hub', label: 'Offers', icon: Sparkles },
  { key: 'assistant', label: 'Assistant', icon: Mic },
  { key: 'report', label: 'Report', icon: FileText },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: ViewKey
  onChange: (v: ViewKey) => void
}) {
  return (
    <nav className="border-t border-border bg-card/95 backdrop-blur-md">
      <ul className="flex items-stretch justify-between px-2 pt-2 pb-5">
        {items.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          const isAssistant = key === 'assistant'

          if (isAssistant) {
            return (
              <li key={key} className="flex flex-1 justify-center">
                <button
                  onClick={() => onChange(key)}
                  className="flex flex-col items-center gap-1"
                  aria-label="Voice AI Assistant"
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span
                    className={`-mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-card transition-transform ${
                      isActive ? 'scale-105' : ''
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span
                    className={`text-[10px] font-medium ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              </li>
            )
          }

          return (
            <li key={key} className="flex flex-1 justify-center">
              <button
                onClick={() => onChange(key)}
                className="flex flex-col items-center gap-1 py-1"
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
