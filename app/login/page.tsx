"use client"

import Link from "next/link"
import { Trophy, CircleDot, Flag, SquareDashedBottomCode } from "lucide-react"
import { LoginCard } from "@/components/login-card"

export default function LoginPage() {
  const tickerItems = [
    { icon: "🥇", text: "1er Premio — Nevera + Cocina + Cilindro de Gas" },
    { icon: "🥈", text: "2do Premio — Smart TV + PS5" },
    { icon: "🥉", text: "3er Premio — iPhone 17 Pro Max" },
    { icon: "🎁", text: "4to Premio Sorpresa — Predice las 4 semifinalistas del Mundial" },
    { icon: "⚽", text: "Cada gol cuenta · Cada córner suma · Cada tarjeta puntúa" },
    { icon: "🇪🇨", text: "Pronostica los 3 partidos de Ecuador en la fase de grupos" },
    { icon: "🔥", text: "#FútbolUno · #FirmesConTamariz · #LaTri · #Mundial2026" },
  ]

  return (
    <div className="min-h-screen bg-background relative">
      <header className="relative z-20 border-b border-cyan-400/10 bg-[#07102d] text-white shadow-[0_2px_0_rgba(255,122,0,0.85)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <span className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-white sm:text-xs">
            #FIRMESCONTAMARIZ
          </span>
          <span className="text-sm font-black uppercase tracking-[0.18em] text-white sm:text-base">
            FÚTBOL <span className="text-[#ff8a00]">1</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-black uppercase tracking-[0.18em] text-white sm:text-xs">
            <span>EC</span>
            <img
              src="/futbolv2/images/ecuador.png"
              alt="Bandera de Ecuador"
              className="h-4 w-4 object-contain sm:h-5 sm:w-5"
            />
          </span>
        </div>
      </header>

      {/* Background image for login page */}
      <div className="absolute inset-0 z-0 bg-[#06102a]">
        <img
          src="/futbolv2/images/fondotelefono.PNG"
          alt="Fondo de móvil"
          className="h-full w-full object-contain object-center scale-95 md:hidden"
        />
        <img
          src="/futbolv2/images/fondocentro.jpeg"
          alt="Fondo de escritorio"
          className="hidden h-full w-full object-contain object-center md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 md:from-black/55 md:via-black/25 md:to-black/10" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div className="order-1 w-full max-w-[560px] justify-self-center lg:order-2 lg:justify-self-end lg:pr-8 xl:pr-12">
            <LoginCard />
          </div>

          <section className="order-2 mx-auto max-w-md text-center text-white lg:order-1 lg:mx-0 lg:-ml-8 lg:text-left lg:pl-0 xl:-ml-12">
            <p className="animate-glow-pulse mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/50 bg-yellow-300/90 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-slate-900 shadow-[0_0_24px_rgba(255,204,0,0.35)] sm:px-3.5 sm:text-[0.72rem]">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.95)]" />
              </span>
              ¡Próximamente en vivo!
            </p>

            <h1 className="text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-5xl lg:text-[5rem]">
              FÚTBOL
            </h1>

            <div className="mt-2 flex items-end gap-3">
              <span className="mx-auto animate-float-y text-[4.5rem] font-black leading-none text-[#ff8a00] drop-shadow-[0_0_18px_rgba(255,138,0,0.55)] sm:text-[5.5rem] lg:mx-0 lg:text-[7rem]">
                1
              </span>
            </div>

            <p className="mt-5 text-lg font-bold text-yellow-300 sm:text-xl">
              Predice. Compite. Gana.
            </p>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-200 sm:text-base lg:mx-0">
              El concurso donde cada gol, cada córner, cada tarjeta y cada triunfo de <span className="font-extrabold text-white">🇪🇨 La Tri</span> te dan puntos reales.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-slate-900/50 px-4 py-2 text-sm font-bold text-white shadow-[0_0_0_1px_rgba(255,122,0,0.12)]">
                <CircleDot className="size-4 text-sky-400" />
                Goles
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-slate-900/50 px-4 py-2 text-sm font-bold text-white shadow-[0_0_0_1px_rgba(255,122,0,0.12)]">
                <Flag className="size-4 text-rose-400" />
                Córners
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-slate-900/50 px-4 py-2 text-sm font-bold text-white shadow-[0_0_0_1px_rgba(255,122,0,0.12)]">
                <SquareDashedBottomCode className="size-4 text-amber-300" />
                Tarjetas
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-slate-900/50 px-4 py-2 text-sm font-bold text-white shadow-[0_0_0_1px_rgba(255,122,0,0.12)]">
                <Trophy className="size-4 text-amber-300" />
                Triunfos
              </span>
            </div>
          </section>
        </div>
      </main>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-orange-400/70 bg-[#a84d00]">
        <div className="ticker-wrap overflow-hidden whitespace-nowrap py-2.5">
          <div className="ticker flex min-w-[200%] w-max items-center gap-6 pl-4 pr-4 text-[0.72rem] font-bold uppercase tracking-wide text-white sm:text-xs">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item.text}-${index}`} className="ticker-item inline-flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.text}</span>
                <span className="sep text-orange-200/90">◆</span>
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
