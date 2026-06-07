"use client"

import { TrendingUp, Clock } from "lucide-react"
import { useBetSlip } from "@/components/bet-slip-provider"
import type { Match } from "@/lib/types"
import { cn } from "@/lib/utils"

function OddsButton({
  match,
  outcome,
  label,
  odds,
}: {
  match: Match
  outcome: string
  label: string
  odds: number
}) {
  const { addSelection, isSelected } = useBetSlip()
  const id = `${match.ID}-${outcome}`
  const selected = isSelected(id)

  return (
    <button
      onClick={() =>
        addSelection({
          id,
          matchId: match.ID,
          matchLabel: `${match.EQUIPO_LOCAL} - ${match.EQUIPO_VISITANTE}`,
          selectionLabel: label,
          odds,
        })
      }
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 rounded-md border py-2 px-1 transition-all min-w-0",
        selected
          ? "border-[#ff8a00] bg-[#25273a] text-primary-foreground"
          : "border-border bg-[#25273a] text-foreground hover:border-primary/60 hover:bg-[#2c2e44]",
      )}
    >
      <span
        className={cn(
          "text-[10px] sm:text-[11px] font-medium uppercase truncate w-full text-center",
          selected ? "text-primary-foreground/80" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      <span className="text-xs sm:text-sm font-bold tabular-nums">{odds.toFixed(2)}</span>
    </button>
  )
}

export function MatchCard({ match }: { match: Match }) {
  // Guard: evita el crash si los datos llegan incompletos
  if (!match?.EQUIPO_LOCAL || !match?.EQUIPO_VISITANTE) {
    console.warn("[MatchCard] Datos incompletos, se omite la tarjeta:", match)
    return null
  }

  const date = new Date(match.FECHA_PARTIDO).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  })
  
  const time = match.HORA_INICIO.substring(0, 5) // Toma "HH:MM" de "HH:MM:SS"

  return (    <article className="rounded-lg border border-border bg-card p-3 sm:p-4 transition-colors hover:border-primary/40">
      {/* Cabecera: Torneo y Fecha */}
      <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate text-[11px] sm:text-xs text-muted-foreground">
          <span className="font-medium text-accent shrink-0 flex items-center gap-1">
            <Clock className="size-3" />
            {date} · {time}
          </span>
          <span className="truncate">· {match.TORNEO}</span>
        </div>
        {match.PRONOSTICADO === "S" && (
          <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary">
            PRONOSTICADO
          </span>
        )}
      </div>

      {/* Equipos con Logos */}
      <div className="mb-3 sm:mb-4 space-y-2 sm:size-y-3">
        <div className="flex items-center gap-3">
          <div className="size-8 sm:size-10 overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center shrink-0">
            <img 
              src={(match.LOGO_LOCAL || "").trim()} 
              alt={match.EQUIPO_LOCAL} 
              className="size-full object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder-team.png")}
            />
          </div>
          <span className="truncate text-sm sm:text-base font-semibold text-foreground leading-tight">
            {match.EQUIPO_LOCAL}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="size-8 sm:size-10 overflow-hidden rounded-full border border-border bg-muted flex items-center justify-center shrink-0">
            <img 
              src={(match.LOGO_VISITANTE || "").trim()} 
              alt={match.EQUIPO_VISITANTE} 
              className="size-full object-cover"
              onError={(e) => (e.currentTarget.src = "/placeholder-team.png")}
            />
          </div>
          <span className="truncate text-sm sm:text-base font-semibold text-foreground leading-tight">
            {match.EQUIPO_VISITANTE}
          </span>
        </div>
      </div>

      {/* Botones de Pronóstico (Simulados ya que no vienen en el JSON de partidos) */}
      <div className="flex gap-1.5 sm:gap-2">
        <OddsButton match={match} outcome="1" label="Local" odds={1.0} />
        <OddsButton match={match} outcome="X" label="Empate" odds={1.0} />
        <OddsButton match={match} outcome="2" label="Visita" odds={1.0} />
      </div>
    </article>
  )
  }