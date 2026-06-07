"use client"

import type { Market } from "@/lib/matches"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const colsClass: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-3 sm:grid-cols-6",
}

export function MarketBlock({
  market,
  selected,
  onSelect,
}: {
  market: Market
  selected?: string
  onSelect: (optionId: string) => void
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b1430]/70 p-4 backdrop-blur-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-4 w-1.5 rounded-full bg-primary" aria-hidden />
        <h3 className="text-sm font-black uppercase tracking-wide text-white">
          {market.title}
        </h3>
      </div>

      <div className={cn("grid gap-2", colsClass[market.cols ?? 3])}>
        {market.options.map((opt) => {
          const isActive = selected === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              aria-pressed={isActive}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_0_18px_rgba(255,122,0,0.5)]"
                  : "border-white/10 bg-white/[0.06] text-white hover:border-primary/60 hover:bg-white/10",
              )}
            >
              {isActive && (
                <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary-foreground/25">
                  <Check className="size-3" />
                </span>
              )}
              <span className="text-sm font-extrabold leading-tight text-balance">
                {opt.label}
              </span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                  isActive
                    ? "bg-primary-foreground/25 text-primary-foreground"
                    : "bg-accent/20 text-accent",
                )}
              >
                {opt.points} Pts
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
