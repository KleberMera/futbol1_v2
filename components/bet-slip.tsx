"use client"

import { useState } from "react"
import { Receipt, Trash2, X, Check, Loader2 } from "lucide-react"
import { useBetSlip } from "@/components/bet-slip-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const QUICK_STAKES = [5, 10, 25, 50]

export function BetSlip({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { selections, removeSelection, clear, totalOdds } = useBetSlip()
  const [stake, setStake] = useState<number>(10)
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")

  const potential = stake > 0 ? stake * totalOdds : 0

  async function placeBet() {
    setStatus("loading")
    try {
      // Simulación de apuesta exitosa (en producción aquí iría tu API externa)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setStatus("success")
      setTimeout(() => {
        clear()
        setStatus("idle")
      }, 2000)
    } catch {
      setStatus("idle")
    }
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border bg-sidebar transition-transform lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:max-w-none lg:translate-x-0 lg:border-l-0",
        open ? "translate-x-0" : "translate-x-full lg:translate-x-0",
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Receipt className="size-5 text-primary" />
          <h2 className="font-bold text-foreground">Cupón de apuestas</h2>
          {selections.length > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {selections.length}
            </span>
          )}
        </div>
        <button className="lg:hidden" onClick={onClose} aria-label="Cerrar cupón">
          <X className="size-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {selections.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-card">
              <Receipt className="size-7 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Tu cupón está vacío</p>
            <p className="max-w-[200px] text-xs text-muted-foreground">
              Toca una cuota para añadir selecciones a tu apuesta.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {selections.map((s) => (
              <li key={s.id} className="rounded-md border border-border bg-card p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs text-muted-foreground">{s.matchLabel}</p>
                    <p className="mt-0.5 font-semibold text-foreground">{s.selectionLabel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold tabular-nums text-primary">{s.odds.toFixed(2)}</span>
                    <button
                      onClick={() => removeSelection(s.id)}
                      aria-label="Quitar selección"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selections.length > 0 && (
        <div className="border-t border-border p-4">
          <div className="mb-3 flex gap-2">
            {QUICK_STAKES.map((q) => (
              <button
                key={q}
                onClick={() => setStake(q)}
                className={cn(
                  "flex-1 rounded-md border py-1.5 text-sm font-semibold tabular-nums transition-colors",
                  stake === q
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/50",
                )}
              >
                €{q}
              </button>
            ))}
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Importe</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
              <input
                type="number"
                min={0}
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
                className="h-10 w-full rounded-md border border-input bg-input/40 pl-7 pr-3 text-sm font-semibold tabular-nums text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
              />
            </div>
          </div>

          <div className="mb-3 space-y-1.5 rounded-md bg-card p-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Cuota total</span>
              <span className="font-semibold tabular-nums text-foreground">{totalOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ganancia potencial</span>
              <span className="font-bold tabular-nums text-primary">€{potential.toFixed(2)}</span>
            </div>
          </div>

          <Button
            className="w-full font-bold"
            size="lg"
            disabled={status !== "idle" || stake <= 0}
            onClick={placeBet}
          >
            {status === "loading" && <Loader2 className="size-4 animate-spin" />}
            {status === "success" && <Check className="size-4" />}
            {status === "idle" && "Realizar apuesta"}
            {status === "loading" && "Procesando..."}
            {status === "success" && "¡Apuesta realizada!"}
          </Button>
        </div>
      )}
    </aside>
  )
}
