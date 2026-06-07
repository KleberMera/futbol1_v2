"use client"

import { SportIcon } from "@/components/sport-icon"
import type { Sport } from "@/lib/types"
import { cn } from "@/lib/utils"
import { SPORTS } from "@/lib/mock-data"

export function SportsNav({
  active,
  onChange,
}: {
  active: string
  onChange: (slug: string) => void
}) {
  const sports = SPORTS
  const items = [{ id: "all", name: "Todos", slug: "todos", icon: "", eventCount: 0 }, ...sports]

  return (
    <nav className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((sport) => {
            const isActive = active === sport.slug
            return (
              <button
                key={sport.id}
                onClick={() => onChange(sport.slug)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-card hover:text-foreground",
                )}
              >
                {sport.slug !== "todos" && <SportIcon slug={sport.slug} className="size-4" />}
                {sport.name}
                {sport.eventCount > 0 && (
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                      isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {sport.eventCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
