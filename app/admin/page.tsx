"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, ShieldCheck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { useAuth } from "../providers"

export default function AdminPage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background text-white">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-[#07102d]/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
          <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Panel administrativo</p>
              <h1 className="mt-3 text-4xl font-black">Bienvenido, {user?.NOMBRES ?? 'Administrador'}</h1>
              <p className="mt-2 text-sm text-slate-300">Solo los usuarios con rol de administrador pueden acceder a esta sección.</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-4 text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Rol actual</p>
              <p className="mt-2 text-xl font-bold text-white">{user?.ROL ?? 'Desconocido'}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-center gap-3 text-orange-400">
                <ShieldCheck className="h-6 w-6" />
                <h2 className="text-lg font-bold">Acceso seguro</h2>
              </div>
              <p className="text-sm text-slate-300">Desde aquí puedes acceder a los reportes, gestionar usuarios y revisar la actividad administrativa.</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-center gap-3 text-sky-400">
                <BarChart3 className="h-6 w-6" />
                <h2 className="text-lg font-bold">Reportes</h2>
              </div>
              <p className="text-sm text-slate-300">Ve el estado de las apuestas, puntajes y resultados detallados.</p>
              <Link
                href="/reporting"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-400"
              >
                Ir a reporting <ArrowRight className="ml-2" />
              </Link>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-center gap-3 text-green-400">
                <ArrowRight className="h-6 w-6" />
                <h2 className="text-lg font-bold">WhatsApp QR</h2>
              </div>
              <p className="text-sm text-slate-300">Accede al QR de WhatsApp exclusivo para administración.</p>
              <Link
                href="/whatsapp-qr"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-emerald-400"
              >
                Ir a WhatsApp QR <ArrowRight className="ml-2" />
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Ruta rápida</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/10 bg-background px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-white/5"
              >
                Ir al inicio
              </Link>
              <Link
                href="/reporting"
                className="inline-flex w-full items-center justify-center rounded-lg bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-400"
              >
                Ver reportes
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
