"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export function SiteHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax"
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-400/10 bg-[#07102d] text-white shadow-[0_2px_0_rgba(255,122,0,0.85)]">
      <div className="relative mx-auto flex w-full max-w-md items-center justify-between px-4 py-3">

        {/* Izquierda — EC + bandera */}
        <span className="flex items-center gap-1.5 text-[0.62rem] font-black uppercase tracking-[0.16em] text-white sm:text-xs">
          <Image
            src="https://flagcdn.com/w40/ec.png"
            alt="Bandera de Ecuador"
            width={20}
            height={14}
            className="h-3.5 w-5 rounded-[2px] object-cover"
            unoptimized
          />
          <span>EC</span>
        </span>

        {/* Centro — título */}
        <span className="absolute left-1/2 -translate-x-1/2 text-base font-black uppercase tracking-[0.18em] text-white sm:text-lg">
          FÚTBOL <span className="text-[#ff8a00]">1</span>
        </span>

        {/* Derecha — Salir */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-[0.62rem] font-black uppercase tracking-[0.16em] text-white hover:text-[#ff8a00] transition-colors sm:text-xs"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
          <span>Salir</span>
        </button>

      </div>
    </header>
  )
}