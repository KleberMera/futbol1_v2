"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MATCHES } from "@/lib/matches"
import { SiteHeader } from "@/components/site-header"
import { CheckCircle2, Download } from "lucide-react"

type UserPredictionSet = Record<
  string,
  {
    result: string
    over15: "si" | "no"
  }
>

type User = {
  id: string
  name: string
  cedula: string
  telefono: string
  predictions: UserPredictionSet
}

const USERS: User[] = [
  {
    id: "user-1",
    name: "Juan Castro",
    cedula: "1712345678",
    telefono: "0998765432",
    predictions: {
      "partido-1": { result: "visitante", over15: "si" },
      "partido-2": { result: "local", over15: "no" },
      "partido-3": { result: "empate", over15: "si" },
    },
  },
  {
    id: "user-2",
    name: "Ana Mejía",
    cedula: "1701234567",
    telefono: "0987654321",
    predictions: {
      "partido-1": { result: "local", over15: "no" },
      "partido-2": { result: "local", over15: "si" },
      "partido-3": { result: "empate", over15: "si" },
    },
  },
  {
    id: "user-3",
    name: "Luis Rivera",
    cedula: "1723456789",
    telefono: "0991234567",
    predictions: {
      "partido-1": { result: "visitante", over15: "si" },
      "partido-2": { result: "local", over15: "si" },
      "partido-3": { result: "visitante", over15: "no" },
    },
  },
]

const ACTUAL_RESULTS: Record<
  string,
  {
    result: string
    over15: "si" | "no"
  }
> = {
  "partido-1": { result: "visitante", over15: "si" },
  "partido-2": { result: "local", over15: "si" },
  "partido-3": { result: "empate", over15: "si" },
}

type SimpleReport = {
  user: User
  points: number
  hits: number
  total: number
  accuracy: number
  matchDetails: Array<{
    matchId: string
    predictedResult: string
    predictedOver15: string
    actualResult: string
    actualOver15: string
    resultCorrect: boolean
    over15Correct: boolean
    points: number
  }>
}

function getUserReport(user: User): SimpleReport {
  const matchDetails = MATCHES.map((match) => {
    const prediction = user.predictions[match.id] ?? { result: "--", over15: "no" }
    const actual = ACTUAL_RESULTS[match.id] ?? { result: "--", over15: "no" }
    const resultCorrect = prediction.result === actual.result
    const over15Correct = prediction.over15 === actual.over15
    const points = (resultCorrect ? 10 : 0) + (over15Correct ? 5 : 0)
    return {
      matchId: match.id,
      predictedResult: prediction.result,
      predictedOver15: prediction.over15,
      actualResult: actual.result,
      actualOver15: actual.over15,
      resultCorrect,
      over15Correct,
      points,
    }
  })
  const points = matchDetails.reduce((sum, item) => sum + item.points, 0)
  const hits = matchDetails.filter((item) => item.resultCorrect && item.over15Correct).length
  const total = matchDetails.length
  const accuracy = total > 0 ? Math.round((hits / total) * 100) : 0
  return { user, points, hits, total, accuracy, matchDetails }
}

export default function ReportingPage() {
  const [selectedUserId, setSelectedUserId] = useState(USERS[0]?.id ?? "")
  const userReports = USERS.map(getUserReport)
  const selectedReport = userReports.find((report) => report.user.id === selectedUserId) ?? userReports[0]
  const leaderboard = [...userReports].sort((a, b) => b.points - a.points)

  return (
    <div className="min-h-screen bg-background text-white">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 rounded-3xl border border-white/10 bg-[#07102d]/80 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Clasificación por usuario</p>
          <h1 className="mt-3 text-3xl font-black">Ranking y detalles de apuestas</h1>
          <p className="mt-2 text-sm text-slate-300">
            Selecciona un usuario para ver sus apuestas, puntos obtenidos y aciertos por partido.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Usuarios</p>
                <p className="mt-3 text-3xl font-black text-white">{USERS.length}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Mejor puntaje</p>
                <p className="mt-3 text-3xl font-black text-white">{leaderboard[0]?.points}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Mejor precisión</p>
                <p className="mt-3 text-3xl font-black text-white">{leaderboard[0]?.accuracy}%</p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#081023]/80 p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Usuario</p>
                  <h2 className="mt-2 text-2xl font-black text-white">{selectedReport.user.name}</h2>
                  <p className="text-sm text-slate-300">{selectedReport.user.cedula} · {selectedReport.user.telefono}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-3 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Puntos</p>
                    <p className="mt-2 text-2xl font-bold text-white">{selectedReport.points}</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3 text-center">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Precisión</p>
                    <p className="mt-2 text-2xl font-bold text-white">{selectedReport.accuracy}%</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {userReports.map((report) => (
                  <button
                    key={report.user.id}
                    type="button"
                    onClick={() => setSelectedUserId(report.user.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${report.user.id === selectedUserId ? "border-orange-500 bg-orange-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-semibold text-white">{report.user.name}</span>
                      <span className="text-sm text-slate-300">{report.points} pts</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#061427]/80 p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Detalle de apuestas</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-200 sm:grid-cols-[1.3fr_1fr_1fr_1fr_0.7fr]">
                <span className="font-semibold text-white">Partido</span>
                <span className="font-semibold text-white">Resultado</span>
                <span className="font-semibold text-white">+1.5</span>
                <span className="font-semibold text-white">Real</span>
                <span className="font-semibold text-white text-right">Pts</span>
              </div>
              <div className="mt-3 space-y-2">
                {selectedReport.matchDetails.map((detail) => {
                  const match = MATCHES.find((item) => item.id === detail.matchId)
                  return (
                    <div key={detail.matchId} className="grid gap-3 rounded-2xl bg-white/5 p-3 text-sm text-slate-200 sm:grid-cols-[1.3fr_1fr_1fr_1fr_0.7fr]">
                      <span className="font-medium text-white">{match?.home.name} vs {match?.away.name}</span>
                      <span className={`${detail.resultCorrect ? "text-emerald-300" : "text-rose-300"}`}>{detail.predictedResult}</span>
                      <span className={`${detail.over15Correct ? "text-emerald-300" : "text-rose-300"}`}>{detail.predictedOver15 === "si" ? "+1.5" : "-1.5"}</span>
                      <span>
                        <div className="text-white">{detail.actualResult}</div>
                        <div className="text-xs text-slate-400">{detail.actualOver15 === "si" ? "+1.5" : "-1.5"}</div>
                      </span>
                      <span className={`text-right font-semibold ${detail.points > 0 ? "text-emerald-300" : "text-rose-300"}`}>{detail.points}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#081023]/80 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Clasificación</p>
                <Button size="sm" variant="secondary">
                  <Download className="mr-2" size={16} /> Exportar
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                {leaderboard.map((report, index) => (
                  <div key={report.user.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="font-semibold text-white">{index + 1}. {report.user.name}</span>
                    <span className="text-sm text-slate-300">{report.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
