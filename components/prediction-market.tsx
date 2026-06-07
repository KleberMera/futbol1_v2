"use client"

import { Check } from "lucide-react"
import type { Market } from "@/lib/matches"
import { cn } from "@/lib/utils"

function gridCols(cols?: number) {
  switch (cols) {
    case 6:
      return "grid-cols-3 lg:grid-cols-6"
    case 4:
      return "grid-cols-2 lg:grid-cols-4"
    case 3:
      return "grid-cols-3"
    default:
      return "grid-cols-2"
  }
}

export function PredictionMarket({
  market,
  selected,
  disabled,
  onSelect,
}: {
  market: Market
  selected?: string
  disabled?: boolean
  onSelect: (optionId: string) => void
}) {
  const done = Boolean(selected)

  return (
    <section
      className={cn(
        "rounded-2xl border bg-[#081023]/80 p-3.5 transition-colors lg:p-4",
        done ? "border-primary/40" : "border-white/10",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "h-4 w-1.5 shrink-0 rounded-full transition-colors",
              done ? "bg-primary" : "bg-white/20",
            )}
            aria-hidden
          />
          <h3 className="truncate text-xs font-bold uppercase tracking-wide text-white lg:text-sm">
            {market.title}
          </h3>
        </div>
        {done ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
            <Check className="size-3" /> Listo
          </span>
        ) : (
          <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-muted-foreground lg:text-xs">
            {market.options.length} opc.
          </span>
        )}
      </div>

      <div className={cn("grid gap-1.5 lg:gap-2", gridCols(market.cols))}>
        {market.options.map((option) => {
          const isActive = selected === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              disabled={disabled}
              aria-pressed={isActive}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition-all lg:py-3",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_0_18px_rgba(255,122,0,0.45)]"
                  : disabled
                    ? "cursor-not-allowed border-white/5 bg-white/[0.02] text-muted-foreground/40"
                    : "border-white/10 bg-white/[0.06] text-white hover:border-primary/50 hover:bg-white/10",
              )}
            >
              {isActive && (
                <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary-foreground/25">
                  <Check className="size-3" />
                </span>
              )}
              <span className="text-xs font-extrabold leading-tight text-balance lg:text-sm">
                {option.label}
              </span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none tabular-nums",
                  isActive
                    ? "bg-primary-foreground/25 text-primary-foreground"
                    : disabled
                      ? "bg-white/5 text-muted-foreground/40"
                      : "bg-accent/20 text-accent",
                )}
              >
                {option.points} pts
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
