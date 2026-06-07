"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/app/providers"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { showError, showLoading } from "@/lib/swal"

export function LoginCard() {
  const { login } = useAuth()
  const [cedula, setCedula] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    showLoading('Iniciando sesión...')

    try {
      await login(cedula, password)
    } catch (err: any) {
      if (err.message === 'REDIRIGIENDO') return
      const msg = err.message || "Error al iniciar sesión"
      setError(msg)
      showError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <aside className="mx-auto w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[480px]">
      <div className="relative">
        <div
          className="rounded-2xl p-1 sm:p-1.5"
          style={{ boxShadow: '0 20px 60px rgba(3,6,18,0.7), 0 10px 30px rgba(255,122,0,0.14)' }}
        >
          <div className="rounded-2xl border-[2px]" style={{ borderColor: 'rgba(255,122,0,0.95)' }}>
            <div
              className="relative overflow-hidden rounded-2xl p-4 sm:p-6"
              style={{
                background: 'linear-gradient(180deg, rgba(6,10,28,0.75), rgba(6,10,28,0.6))',
                border: '1px solid rgba(255,122,0,0.12)',
                backdropFilter: 'blur(6px)',
              }}
            >
              {/* Header */}
              <div className="mb-4 flex items-center gap-3 sm:mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 sm:h-[26px] sm:w-[26px]">
                  <path d="M9 4V3h6v1a5 5 0 0 1 4 4v1a3 3 0 0 1-3 3h-1.5A4.5 4.5 0 0 1 10.5 16H9a3 3 0 0 1-3-3V8a5 5 0 0 1 4-4z" stroke="#ffb347" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 18h10v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1z" stroke="#ffb347" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <h3 className="text-base uppercase font-extrabold tracking-tight text-foreground sm:text-lg">FÚTBOL <span className="text-primary">UNO</span></h3>
                  <p className="text-[0.68rem] text-muted-foreground sm:text-xs">Tu arena de pronósticos mundialistas</p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-center dark:bg-red-950 dark:border-red-800">
                  <p className="text-xs font-bold text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <label className="mb-2 block text-[0.68rem] font-semibold text-muted-foreground sm:text-xs">Cédula</label>
                <input
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="1234567890"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  className="mb-3.5 w-full rounded-md bg-[rgba(255,255,255,0.02)] px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground border border-[rgba(255,255,255,0.03)] focus:border-primary sm:mb-4"
                />

                <label className="mb-2 block text-[0.68rem] font-semibold text-muted-foreground sm:text-xs">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                  className="mb-3.5 w-full rounded-md bg-[rgba(255,255,255,0.02)] px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground border border-[rgba(255,255,255,0.03)] focus:border-primary sm:mb-4"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full flex-1 font-bold bg-gradient-to-r from-[#ff7a00] to-[#ffb347] text-primary-foreground py-3"
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Ingresando...</>
                    ) : (
                      "INGRESAR"
                    )}
                  </Button>
                  <Link href="/register" className="inline-flex w-full flex-1 items-center justify-center rounded-lg border border-[rgba(255,122,0,0.85)] bg-transparent px-3 py-3 text-sm font-semibold text-primary transition hover:bg-white/5 sm:text-base">
                    REGISTRARME
                  </Link>
                </div>
              </form>

              <div className="mt-3 flex items-center justify-between gap-4 text-[0.72rem] text-muted-foreground sm:text-xs">
                <p className="max-w-[65%]">¿Olvidaste tu contraseña?</p>
                <Link href="/reset-password" className="font-bold text-white underline-offset-2 hover:underline">
                  Restablecer
                </Link>
              </div>

              <p className="mt-4 text-[0.72rem] text-muted-foreground sm:text-xs">¡Estamos listos! Sé el primero en entrar cuando arranque el juego.</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}