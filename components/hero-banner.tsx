"use client"

import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-card min-h-[420px]">
      <div className="absolute inset-0">
        <img
          src="/futbolv2/images/fondocentro.jpeg"
          alt="Fondo centro"
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      </div>
      <div className="relative flex flex-col gap-4 p-6 sm:p-8">
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
          <Zap className="size-3.5" />
          Temporada de lanzamiento
        </span>
        <h1 className="max-w-3xl text-balance text-4xl font-black leading-tight text-foreground sm:text-6xl">
          Descubre cuotas destacadas y vive los pronósticos con intensidad
        </h1>
        <p className="max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground">
          Analiza partidos, compara cuotas y participa en una experiencia deportiva pensada para quienes disfrutan cada minuto.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="font-bold">
            Crear cuenta gratis
          </Button>
          <Button size="lg" variant="outline" className="bg-transparent font-semibold">
            Ver promociones
          </Button>
        </div>
      </div>
    </section>
  )
}
