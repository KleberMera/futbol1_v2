"use client"

import { useEffect, useState } from "react"
import { Flame } from "lucide-react"
import { MatchCard } from "@/components/match-card"
import type { Match } from "@/lib/types"
import { useAuth } from "@/app/providers"

export function MatchList({ sport }: { sport: string }) {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  
  const API_BASE = process.env.NEXT_PUBLIC_API_URL 

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user?.ID) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE}/partido/usuario/${user.ID}`)
        const result = await response.json()
        if (result.status === 200 && Array.isArray(result.data)) {
          setMatches(result.data)
        }
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [user?.ID, API_BASE])

  // En la nueva estructura no tenemos sport/live diferenciado así que mostramos todos los del torneo
  const allMatches = matches.filter(
    (m): m is Match => Boolean(m?.EQUIPO_LOCAL && m?.EQUIPO_VISITANTE),
  )

  if (isLoading) {
    return (
      <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-36 sm:h-44 animate-pulse rounded-lg border border-border bg-card"
          />
        ))}
      </div>
    )
  }

  if (allMatches.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 sm:p-10 text-center text-sm text-muted-foreground">
        No hay eventos disponibles para este deporte ahora mismo.
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <section>
        <div className="mb-2 sm:mb-3 flex items-center gap-2">
          <Flame className="size-3.5 sm:size-4 text-accent" />
          <h2 className="text-xs sm:text-sm font-bold text-foreground">Eventos disponibles</h2>
          <span className="text-xs sm:text-sm text-muted-foreground">({allMatches.length})</span>
        </div>
        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
          {allMatches.map((m) => (
            <MatchCard key={m.ID} match={m} />
          ))}
        </div>
      </section>
    </div>
  )
}