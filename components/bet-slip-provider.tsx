"use client"

import type React from "react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { BetSelection } from "@/lib/types"

type BetSlipContextValue = {
  selections: BetSelection[]
  addSelection: (selection: BetSelection) => void
  removeSelection: (id: string) => void
  clear: () => void
  isSelected: (id: string) => boolean
  totalOdds: number
}

const BetSlipContext = createContext<BetSlipContextValue | null>(null)

export function BetSlipProvider({ children }: { children: React.ReactNode }) {
  const [selections, setSelections] = useState<BetSelection[]>([])

  const addSelection = useCallback((selection: BetSelection) => {
    setSelections((prev) => {
      // Solo una selección por partido
      const filtered = prev.filter((s) => s.matchId !== selection.matchId)
      if (prev.some((s) => s.id === selection.id)) {
        return prev.filter((s) => s.id !== selection.id)
      }
      return [...filtered, selection]
    })
  }, [])

  const removeSelection = useCallback((id: string) => {
    setSelections((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const clear = useCallback(() => setSelections([]), [])

  const isSelected = useCallback(
    (id: string) => selections.some((s) => s.id === id),
    [selections],
  )

  const totalOdds = useMemo(
    () => selections.reduce((acc, s) => acc * s.odds, 1),
    [selections],
  )

  const value = useMemo(
    () => ({ selections, addSelection, removeSelection, clear, isSelected, totalOdds }),
    [selections, addSelection, removeSelection, clear, isSelected, totalOdds],
  )

  return <BetSlipContext.Provider value={value}>{children}</BetSlipContext.Provider>
}

export function useBetSlip() {
  const ctx = useContext(BetSlipContext)
  if (!ctx) throw new Error("useBetSlip debe usarse dentro de BetSlipProvider")
  return ctx
}
