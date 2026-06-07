export type Sport = {
  id: string
  name: string
  slug: string
  icon: string
  eventCount: number
}

export type Outcome = {
  label: string
  odds: number
}

export type Market = {
  // Resultado final: 1 (local) / X (empate) / 2 (visitante)
  home: number
  draw?: number
  away: number
}

export type Match = {
  ID: number
  TORNEO_ID: number
  TORNEO: string
  EQUIPO_LOCAL_ID: number
  EQUIPO_LOCAL: string
  SIGLA_LOCAL: string
  LOGO_LOCAL: string
  LOGO_VISITANTE: string
  EQUIPO_VISITANTE_ID: number
  EQUIPO_VISITANTE: string
  SIGLA_VISITANTE: string
  FECHA_PARTIDO: string // ISO
  HORA_INICIO: string
  FECHA_CIERRE_PRONOSTICO: string // ISO
  PRONOSTICADO: string // "N" o "S"
}

export type BetSelection = {
  id: string // matchId + outcome
  matchId: number
  matchLabel: string
  selectionLabel: string
  odds: number
}
