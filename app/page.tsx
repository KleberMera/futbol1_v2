"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import { MATCHES as STATIC_MATCHES, commonMarkets, type Match } from "@/lib/matches"
import { SiteHeader } from "@/components/site-header"
import { SiteTicker } from "@/components/site-ticker"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Trophy, Check, Send, Loader2 } from "lucide-react"
import { showLoading, showError, showSuccess, showConfirm, showInfo } from "@/lib/swal"
import { useAuth } from "./providers"

type AllPicks = Record<string, Record<string, string>>

export default function Page() {
  const { user } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [current, setCurrent] = useState(0)
  const [picks, setPicks] = useState<AllPicks>({})
  const [sent, setSent] = useState<Record<string, boolean>>({})
  const [hasShownInitialInfo, setHasShownInitialInfo] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL 

  // 1. Cargar Partidos iniciales
  useEffect(() => {
    async function fetchMatches() {
      if (!user?.ID) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`${API_BASE}/partido/usuario/${user.ID}`)
        const result = await response.json()
        if (result.status === 200 && Array.isArray(result.data)) {
          const mappedMatches: Match[] = result.data.map((m: any) => ({
            id: m.ID.toString(),
            competition: m.TORNEO,
            home: { name: m.EQUIPO_LOCAL, flag: (m.LOGO_LOCAL || "").trim() },
            away: { name: m.EQUIPO_VISITANTE, flag: (m.LOGO_VISITANTE || "").trim() },
            markets: [], // Se llenarán dinámicamente
          }))
          setMatches(mappedMatches)
          
          const initialSent: Record<string, boolean> = {}
          result.data.forEach((m: any) => {
            if (m.PRONOSTICADO === 'S') {
              initialSent[m.ID.toString()] = true
            }
          })
          setSent(initialSent)

          // Mostrar info inicial si el primer partido ya está enviado
          if (mappedMatches.length > 0 && initialSent[mappedMatches[0].id] && !hasShownInitialInfo) {
            showInfo(
              'Partido Pronosticado',
              `Ya has enviado tus pronósticos para el partido ${mappedMatches[0].home.name} vs ${mappedMatches[0].away.name}.`
            )
            setHasShownInitialInfo(true)
          }
        }
      } catch (error) {
        console.error("Error fetching matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMatches()
  }, [user?.ID, API_BASE, hasShownInitialInfo])

  const total = matches.length
  const match = matches[current]
  const matchPicks = match ? (picks[match.id] ?? {}) : {}

  // 2. Cargar Opciones/Mercados para el partido actual
  useEffect(() => {
    async function fetchMatchOptions() {
      if (!user?.ID || !match) return

      try {
        const response = await fetch(`${API_BASE}/partido/${match.id}/usuario/${user.ID}/opciones`)
        const result = await response.json()
        
        if (result.status === 200 && Array.isArray(result.data)) {
          const marketsMap: Record<string, any> = {}
          const newPicks: Record<string, string> = { ...(picks[match.id] ?? {}) }
          
          result.data.forEach((item: any) => {
            const mId = item.TIPO_PRONOSTICO_ID.toString()
            if (!marketsMap[mId]) {
              marketsMap[mId] = {
                id: mId,
                title: item.TIPO_PRONOSTICO,
                options: [],
                cols: 2
              }
              if (item.TIPO_PRONOSTICO === "MARCADOR") marketsMap[mId].cols = 3
              if (item.TIPO_PRONOSTICO.includes("TOTAL GOLES")) marketsMap[mId].cols = 4
            }
            
            marketsMap[mId].options.push({
              id: item.OPCION_PRONOSTICO_ID.toString(),
              label: item.OPCION,
              points: item.PUNTOS
            })
            
            if (item.SELECCIONADO === "S") {
              newPicks[mId] = item.OPCION_PRONOSTICO_ID.toString()
            }
          })
          
          const updatedMarkets = Object.values(marketsMap)
          setMatches(prev => prev.map(m => 
            m.id === match.id ? { ...m, markets: updatedMarkets } : m
          ))
          
          setPicks(prev => ({ ...prev, [match.id]: newPicks }))
        }
      } catch (error) {
        console.error("Error fetching match options:", error)
      }
    }

    fetchMatchOptions()
  }, [match?.id, user?.ID, API_BASE])

  const completedCount = (matchId: string) => Object.keys(picks[matchId] ?? {}).length

  const matchPoints = (matchId: string) => {
    const m = matches.find((x) => x.id === matchId)
    if (!m) return 0
    const mp = picks[matchId] ?? {}
    return m.markets.reduce((acc, market) => {
      const opt = market.options.find((o) => o.id === mp[market.id])
      return acc + (opt?.points ?? 0)
    }, 0)
  }

  const totalPoints = useMemo(
    () => matches.reduce((acc, m) => acc + matchPoints(m.id), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [picks, matches],
  )


  function handlePick(marketId: string, optionId: string) {
    if (!match || thisMatchSent) return
    setSent((prev) => ({ ...prev, [match.id]: false }))
    setPicks((prev) => ({
      ...prev,
      [match.id]: { ...(prev[match.id] ?? {}), [marketId]: optionId },
    }))
  }

  async function handleSendPronostico() {
    if (!match || !user?.ID || thisMatchSent) return

    // 1. Confirmación
    const result = await showConfirm(
      '¿Enviar pronóstico?',
      `¿Estás seguro de que tus datos para ${match.home.name} vs ${match.away.name} son correctos?`,
      'Sí, enviar'
    )

    if (!result.isConfirmed) return

    const details = Object.entries(matchPicks).map(([marketId, optionId]) => ({
      TIPO_PRONOSTICO_ID: parseInt(marketId),
      OPCION_PRONOSTICO_ID: parseInt(optionId),
    }))

    const payload = {
      USUARIO_ID: user.ID,
      PARTIDO_ID: parseInt(match.id),
      DETALLES: details,
    }

    // 2. Cargando
    showLoading('Enviando tu pronóstico...')

    try {
      const response = await fetch(`${API_BASE}/pronostico`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setSent((prev) => ({ ...prev, [match.id]: true }))
        showSuccess('¡Tu pronóstico ha sido enviado con éxito!')
        
        // Navegar al siguiente partido si existe
        if (current < total - 1) {
          setTimeout(() => {
            goTo(current + 1)
          }, 1500)
        }
      } else {
        const data = await response.json()
        showError(data.message || "Error al enviar el pronóstico")
      }
    } catch (error) {
      console.error("Error en la petición:", error)
      showError("Hubo un problema de conexión al enviar tu pronóstico.")
    }
  }

  function goTo(index: number) {
    const next = Math.max(0, Math.min(total - 1, index))
    const targetMatch = matches[next]

    // Si el partido al que vamos ya está enviado, mostrar info
    if (sent[targetMatch.id]) {
      showInfo(
        'Partido Pronosticado',
        `Ya has enviado tus pronósticos para el partido ${targetMatch.home.name} vs ${targetMatch.away.name}.`
      )
    }

    setCurrent(next)
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#06102a] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium">Cargando partidos...</p>
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <SiteHeader />
        <div className="flex flex-1 items-center justify-center p-8 text-center">
          <p className="text-muted-foreground">No hay partidos disponibles en este momento.</p>
        </div>
      </div>
    )
  }

  const thisMatchDone = completedCount(match.id)
  const thisMatchSent = sent[match.id]
  const hasPicks = thisMatchDone > 0

  // Altura fija del footer (barra acción + ticker)
  // barra acción ~96px + ticker ~44px = 140px
  const FOOTER_HEIGHT = 140

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">

      {/* Fondos */}
      <div className="pointer-events-none fixed left-0 right-0 top-[72px] bottom-[140px] z-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-0 top-0 bottom-0 md:hidden">
          <Image
            src="/futbolv2/images/fondotelefono.PNG"
            alt="Fondo móvil"
            fill
            className="object-contain opacity-90"
            style={{ objectPosition: '50% 90%' }}
            unoptimized
          />
        </div>
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="/futbolv2/images/fondocentro.jpeg"
            alt="Fondo de escritorio"
            fill
            className="object-contain opacity-90"
            style={{ objectPosition: '50% 90%' }}
            unoptimized
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#06102a]/75 via-[#06102a]/90 to-[#06102a]/95" />
        <div className="absolute left-1/2 top-24 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <SiteHeader />

        {/* ══════════════════════════════════════
            MÓVIL (< lg)
            ══════════════════════════════════════ */}
        <div className="lg:hidden flex flex-col flex-1">

          {/* Pestañas FIJAS — no se mueven con el scroll */}
          <div className="sticky top-[53px] z-20 bg-[#07102d]/98 backdrop-blur-sm px-4 pt-3 pb-2 border-b border-white/5">
            <nav
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}
              aria-label="Partidos"
            >
              {matches.map((m, i) => {
                const done = completedCount(m.id)
                const isActive = i === current
                const isSent = sent[m.id]
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isActive}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition-all",
                      isActive
                        ? "border-primary bg-primary/20 shadow-[0_0_14px_rgba(255,122,0,0.35)]"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    )}
                  >
                    <span className="flex items-center gap-1">
                      <Image src={m.home.flag || "/placeholder.svg"} alt={m.home.name}
                        width={26} height={18}
                        className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-white/20"
                        unoptimized />
                      <span className="text-[8px] font-black text-muted-foreground">VS</span>
                      <Image src={m.away.flag || "/placeholder.svg"} alt={m.away.name}
                        width={26} height={18}
                        className="h-4 w-6 rounded-[2px] object-cover ring-1 ring-white/20"
                        unoptimized />
                    </span>
                    <span className={cn(
                      "text-[9px] font-black uppercase leading-tight tracking-tight text-balance",
                      isActive ? "text-white" : "text-muted-foreground",
                    )}>
                      {m.home.name.split(" ")[0]} (L) vs {m.away.name.split(" ")[0]} (V)
                    </span>
                    <span className="flex items-center gap-1 text-[9px] font-bold">
                      {isSent
                        ? <span className="inline-flex items-center gap-0.5 text-emerald-400"><Check className="size-2.5" /> Enviado</span>
                        : <span className="text-muted-foreground">{done}/{m.markets.length}</span>
                      }
                    </span>
                  </button>
                )
              })}
            </nav>

            {/* Resumen pts — también fijo */}
            <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Partidos · <span className="text-white">{matches.filter(m => sent[m.id]).length}/{total} enviados</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-xs font-black text-primary">
                <Trophy className="size-3.5" />{matchPoints(match.id)} pts
              </span>
            </div>
          </div>

          {/* Zona de scroll — solo los mercados se desplazan */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 py-4"
            style={{ paddingBottom: `${FOOTER_HEIGHT + 16}px` }}
          >
            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              {match.markets.map((market) => {
                const selectedOption = matchPicks[market.id]
                return (
                  <div key={market.id} className="rounded-3xl border border-white/10 bg-[#081023]/80 p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-white">{market.title}</p>
                      <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {market.options.length} opc.
                      </span>
                    </div>
                    <div className={cn(
                      "grid gap-2",
                      market.cols === 6 ? "grid-cols-3 sm:grid-cols-6"
                        : market.cols === 4 ? "grid-cols-2 sm:grid-cols-4"
                        : market.cols === 3 ? "grid-cols-3"
                        : "grid-cols-2",
                    )}>
                      {market.options.map((option) => {
                        const isActive = selectedOption === option.id
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handlePick(market.id, option.id)}
                            disabled={thisMatchSent}
                            className={cn(
                              "rounded-2xl border px-3 py-3 text-left text-sm font-semibold transition-all",
                              isActive
                                ? "border-primary bg-primary/15 text-white"
                                : thisMatchSent 
                                  ? "border-white/5 bg-white/2 text-muted-foreground/50 cursor-not-allowed"
                                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/40 hover:bg-white/10",
                            )}
                          >
                            <span>{option.label}</span>
                            <span className="mt-2 block text-xs font-medium text-muted-foreground">
                              {option.points} pts
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Resumen final */}
            <div className="mt-4 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-center">
              <p className="text-sm font-bold text-white">{match.home.name} (Local) vs {match.away.name} (Visitante)</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {thisMatchDone}/{match.markets.length} · {matchPoints(match.id)} pts
              </p>
              {thisMatchSent ? (
                <>
                  <p className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">
                    <Check className="size-3.5" /> Pronóstico enviado
                  </p>
                  {current < total - 1 && (
                    <Button size="lg" variant="secondary" onClick={() => goTo(current + 1)} className="mt-3 w-full font-bold">
                      Ir al siguiente partido <ChevronRight className="size-4" />
                    </Button>
                  )}
                  <p className="mt-2 text-[11px] text-muted-foreground">Puedes seguir con los demás partidos cuando quieras.</p>
                </>
              ) : (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Usa el botón <span className="font-bold text-primary">Pronosticar</span> de abajo para enviar este partido.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            DESKTOP (≥ lg): 2 columnas
            ══════════════════════════════════════ */}
        <main className="hidden lg:flex flex-1 gap-6 px-6 py-6 xl:px-10 xl:py-8 mx-auto w-full max-w-7xl"
          style={{ paddingBottom: "calc(44px + 1.5rem)" }}
        >
          {/* Columna izquierda */}
          <aside className="flex w-72 xl:w-80 shrink-0 flex-col gap-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
              Partidos · {matches.filter((m) => sent[m.id]).length}/{total} enviados
            </h2>
            {matches.map((m, i) => {
              const done = completedCount(m.id)
              const isActive = i === current
              const isSent = sent[m.id]
              const pts = matchPoints(m.id)
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={cn(
                    "group relative flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all",
                    isActive
                      ? "border-primary bg-primary/10 shadow-[0_0_24px_rgba(255,122,0,0.2)]"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8",
                  )}
                >
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-primary" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{m.competition}</span>
                  <div className="space-y-2">
                    {[
                      { ...m.home, label: "(Local)" },
                      { ...m.away, label: "(Visitante)" }
                    ].map((team, ti) => (
                      <div key={ti} className="flex items-center gap-2.5">
                        <Image src={team.flag || "/placeholder.svg"} alt={team.name}
                          width={32} height={22} className="h-5 w-7 rounded-sm object-cover ring-1 ring-white/20" unoptimized />
                        <span className={cn("text-sm font-bold leading-tight",
                          isActive ? "text-white" : "text-foreground/80 group-hover:text-white")}>
                          {team.name} <span className="text-[10px] opacity-60 font-normal">{team.label}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-white/10 overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", isSent ? "bg-emerald-400" : "bg-primary")}
                          style={{ width: `${(done / m.markets.length) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-muted-foreground">{done}/{m.markets.length}</span>
                    </div>
                    {isSent
                      ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400"><Check className="size-2.5" /> Enviado</span>
                      : pts > 0
                        ? <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-black text-primary"><Trophy className="size-2.5" /> {pts} pts</span>
                        : null
                    }
                  </div>
                </button>
              )
            })}
            <div className="mt-auto rounded-2xl border border-accent/20 bg-accent/5 p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Puntaje total potencial</p>
              <p className="mt-1 text-3xl font-black text-primary">{totalPoints}</p>
              <p className="text-xs text-muted-foreground">pts</p>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#ff8a00]">#FIRMESCONTAMARIZ</p>
            </div>
          </aside>

          {/* Columna derecha */}
          <div className="flex flex-1 flex-col min-w-0 gap-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-3">
              <div className="flex items-center gap-3">
                <Image src={match.home.flag || "/placeholder.svg"} alt={match.home.name}
                  width={36} height={24} className="h-6 w-9 rounded-sm object-cover ring-1 ring-white/20" unoptimized />
                <span className="text-sm font-bold text-white">{match.home.name} <span className="text-[10px] opacity-60 font-normal">(Local)</span></span>
                <span className="text-xs font-black text-muted-foreground">VS</span>
                <span className="text-sm font-bold text-white">{match.away.name} <span className="text-[10px] opacity-60 font-normal">(Visitante)</span></span>
                <Image src={match.away.flag || "/placeholder.svg"} alt={match.away.name}
                  width={36} height={24} className="h-6 w-9 rounded-sm object-cover ring-1 ring-white/20" unoptimized />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-black text-primary">
                <Trophy className="size-3.5" />{thisMatchDone}/{match.markets.length} · {matchPoints(match.id)} pts
              </span>
            </div>

            <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3 lg:space-y-4 lg:rounded-3xl lg:p-4">
                {match.markets.map((market) => {
                  const selectedOption = matchPicks[market.id]
                  return (
                    <div key={market.id} className="rounded-2xl border border-white/10 bg-[#081023]/80 p-3 lg:rounded-3xl lg:p-4">
                      <div className="mb-2 flex items-center justify-between gap-2 lg:mb-3">
                        <p className="text-xs font-semibold text-white lg:text-sm">{market.title}</p>
                        <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-muted-foreground lg:text-xs">
                          {market.options.length} opc.
                        </span>
                      </div>
                      <div className={cn("grid gap-1.5 lg:gap-2",
                        market.cols === 6 ? "grid-cols-3 lg:grid-cols-6"
                          : market.cols === 4 ? "grid-cols-2 lg:grid-cols-4"
                          : market.cols === 3 ? "grid-cols-3"
                          : "grid-cols-2",
                      )}>
                        {market.options.map((option) => {
                          const isActive = selectedOption === option.id
                          return (
                            <button key={option.id} type="button" 
                              onClick={() => handlePick(market.id, option.id)}
                              disabled={thisMatchSent}
                              className={cn(
                                "rounded-xl border px-2 py-2.5 text-left text-xs font-semibold transition-all lg:rounded-2xl lg:px-3 lg:py-3 lg:text-sm",
                                isActive
                                  ? "border-primary bg-primary/15 text-white"
                                  : thisMatchSent
                                    ? "border-white/5 bg-white/2 text-muted-foreground/50 cursor-not-allowed"
                                    : "border-white/10 bg-white/5 text-muted-foreground hover:border-primary/40 hover:bg-white/10",
                              )}>
                              <span className="block leading-tight">{option.label}</span>
                              <span className="mt-1 block text-[10px] font-medium text-muted-foreground lg:mt-2 lg:text-xs">
                                {option.points} pts
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-3 rounded-2xl border border-accent/30 bg-accent/10 p-3 text-center lg:mt-4 lg:p-4">
                <p className="text-sm font-bold text-white">{match.home.name} (Local) vs {match.away.name} (Visitante)</p>
                <p className="mt-1 text-[10px] text-muted-foreground lg:text-xs">
                  {thisMatchDone} de {match.markets.length} pronósticos · {matchPoints(match.id)} pts potenciales
                </p>
                {thisMatchSent ? (
                  <>
                    <p className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-bold text-emerald-300 lg:text-xs">
                      <Check className="size-3 lg:size-3.5" /> Pronóstico enviado
                    </p>
                    {current < total - 1 && (
                      <Button size="lg" variant="secondary" onClick={() => goTo(current + 1)} className="mt-3 w-full font-bold">
                        Ir al siguiente partido <ChevronRight className="size-4" />
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="mt-2 text-[10px] text-muted-foreground lg:text-[11px]">
                    Usa el botón <span className="font-bold text-primary">Pronosticar</span> de abajo para enviar este partido.
                  </p>
                )}
              </div>
              {/* Espacio extra para que nada quede tapado */}
              <div className="h-6" aria-hidden />
            </div>

            <div className="shrink-0 rounded-2xl border-t border-white/10 bg-[#07102d]/95 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="lg" className="flex-1"
                  onClick={() => goTo(current - 1)} disabled={current === 0}>
                  <ChevronLeft className="size-4" /> Anterior
                </Button>
                <Button size="lg" disabled={!hasPicks || thisMatchSent}
                  onClick={handleSendPronostico}
                  className={cn("flex-[2] font-black uppercase tracking-wide",
                    thisMatchSent ? "bg-emerald-500 text-white opacity-100" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
                  {thisMatchSent
                    ? <><Check className="size-4" /> Pronóstico enviado</>
                    : <><Send className="size-4" /> Pronosticar este partido</>
                  }
                </Button>
                {current < total - 1 && (
                  <Button variant="secondary" size="lg" className="flex-1" onClick={() => goTo(current + 1)}>
                    Siguiente <ChevronRight className="size-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Barra fija móvil */}
        <div className="lg:hidden fixed inset-x-0 z-40 border-t border-white/10 bg-[#07102d]/95 px-4 py-3 backdrop-blur-md"
          style={{ bottom: "44px" }}>
          <div className="mx-auto flex w-full max-w-md items-center gap-2">
            <Button variant="secondary" size="lg" className="flex-1"
              onClick={() => goTo(current - 1)} disabled={current === 0}>
              <ChevronLeft className="size-4" /> Anterior
            </Button>
            <Button size="lg" disabled={!hasPicks || thisMatchSent}
              onClick={handleSendPronostico}
              className={cn("flex-[1.6] font-black uppercase tracking-wide",
                thisMatchSent ? "bg-emerald-500 text-white opacity-100" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
              {thisMatchSent
                ? <><Check className="size-4" /> Enviado</>
                : <><Send className="size-4" /> Pronosticar</>
              }
            </Button>
          </div>
          <p className="mt-1.5 text-center text-[9px] text-muted-foreground">
            Partido {current + 1} de {total} · Puntaje total: <span className="font-bold text-white">{totalPoints} pts</span>
          </p>
          <p className="mt-0.5 text-center text-[9px] font-black uppercase tracking-[0.18em] text-[#ff8a00]">
            #FIRMESCONTAMARIZ
          </p>
        </div>

        {/* Ticker siempre fijo */}
        <div className="fixed inset-x-0 bottom-0 z-50">
          <SiteTicker />
        </div>
      </div>
    </div>
  )
}