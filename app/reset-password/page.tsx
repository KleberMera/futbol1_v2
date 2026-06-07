"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"
import { showLoading, showError, showSuccess } from "@/lib/swal"

const API_BASE = process.env.NEXT_PUBLIC_API_URL 

const tickerItems = [
  { icon: "🥇", text: "1er Premio — Nevera + Cocina + Cilindro de Gas" },
  { icon: "🥈", text: "2do Premio — Smart TV + PS5" },
  { icon: "🥉", text: "3er Premio — iPhone 17 Pro Max" },
  { icon: "🎁", text: "4to Premio Sorpresa — Predice las 4 semifinalistas del Mundial" },
  { icon: "⚽", text: "Cada gol cuenta · Cada córner suma · Cada tarjeta puntúa" },
  { icon: "🇪🇨", text: "Pronostica los 3 partidos de Ecuador en la fase de grupos" },
  { icon: "🔥", text: "#FútbolUno · #FirmesConTamariz · #LaTri · #Mundial2026" },
]

const STEPS = [
  { id: 1, label: "Cédula" },
  { id: 2, label: "Código" },
  { id: 3, label: "Contraseña" },
]

export default function ResetPasswordPage() {
  const [step, setStep]                       = useState(1)
  const [cedula, setCedula]                   = useState("")
  const [otp, setOtp]                         = useState("")
  const [password, setPassword]               = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading]                 = useState(false)
  const [error, setError]                     = useState("")
  const [success, setSuccess]                 = useState(false)

  const stepSubtitle = [
    "Ingresa tu cédula",
    "Código enviado por WhatsApp",
    "Crea tu nueva contraseña",
  ][step - 1]

  // ── STEP 1: pedir código ──────────────────────────────────────────────────
  const handleSendCode = async () => {
    setError("")
    if (!cedula.trim()) { setError("Ingresa tu cédula"); return }
    setLoading(true)
    showLoading('Enviando código...')
    try {
      const res = await fetch(`${API_BASE}/usuario/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CEDULA: cedula.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Error al enviar el código")
      showSuccess('Código enviado por WhatsApp')
      setStep(2)
    } catch (err: any) {
      setError(err.message)
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── STEP 2: validar código ────────────────────────────────────────────────
  const handleVerifyCode = async () => {
    setError("")
    if (!otp.trim()) { setError("Ingresa el código"); return }
    setLoading(true)
    showLoading('Verificando código...')
    try {
      const res = await fetch(`${API_BASE}/usuario/password-reset/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CEDULA: cedula.trim(), CODE: otp.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Código incorrecto")
      showSuccess('Código validado correctamente')
      setStep(3)
    } catch (err: any) {
      setError(err.message)
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── STEP 3: nueva contraseña ──────────────────────────────────────────────
  const handleReset = async () => {
    setError("")
    if (!password || !confirmPassword)  { setError("Completa ambos campos"); return }
    if (password !== confirmPassword)   { setError("Las contraseñas no coinciden"); return }
    if (password.length < 6)           { setError("Mínimo 6 caracteres"); return }
    setLoading(true)
    showLoading('Actualizando contraseña...')
    try {
      const res = await fetch(`${API_BASE}/usuario/password-reset/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CEDULA:   cedula.trim(),
          CODE:     otp.trim(),
          PASSWORD: password,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? "Error al cambiar contraseña")
      showSuccess('Tu contraseña ha sido actualizada')
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
      showError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative">

      {/* ── HEADER ── */}
      <header className="relative z-20 border-b border-cyan-400/10 bg-[#07102d] text-white shadow-[0_2px_0_rgba(255,122,0,0.85)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-3 sm:px-6 sm:py-3">
          <span className="text-[0.6rem] font-black uppercase tracking-[0.14em] text-white sm:text-xs sm:tracking-[0.18em]">#FIRMESCONTAMARIZ</span>
          <span className="text-sm font-black uppercase tracking-[0.18em] text-white sm:text-base shrink-0">FÚTBOL <span className="text-[#ff8a00]">1</span></span>
          <span className="inline-flex items-center gap-1 text-[0.6rem] font-black uppercase tracking-[0.14em] text-white sm:gap-1.5 sm:text-xs sm:tracking-[0.18em]">
            <span>EC</span>
            <img src="/futbolv2/images/ecuador.png" alt="Ecuador" className="h-3.5 w-3.5 object-contain sm:h-5 sm:w-5" />
          </span>
        </div>
      </header>

      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 z-0 bg-[#06102a]">
        <img src="/futbolv2/images/fondotelefono.PNG" alt="" className="h-full w-full object-contain object-center scale-95 md:hidden" />
        <img src="/futbolv2/images/fondocentro.jpeg"  alt="" className="hidden h-full w-full object-contain object-center md:block" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/10 md:from-black/55 md:via-black/25 md:to-black/10" />
      </div>

      {/* ── MAIN ── */}
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <div className="grid w-full items-center gap-6 sm:gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">

          {/* ── HERO ── */}
          <section className="order-2 mx-auto w-full max-w-md text-center text-white lg:order-1 lg:mx-0 lg:text-left">
            <p className="animate-glow-pulse mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/50 bg-yellow-300/90 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-slate-900 shadow-[0_0_24px_rgba(255,204,0,0.35)] sm:px-3.5 sm:text-[0.72rem]">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.95)]" />
              </span>
              Restablece tu acceso
            </p>
            <h1 className="text-3xl font-black uppercase leading-[0.9] tracking-tight xs:text-4xl sm:text-5xl lg:text-[5rem]">Recupera tu cuenta</h1>
            <p className="mt-4 max-w-sm text-base font-bold text-yellow-300 sm:mt-5 sm:text-xl lg:mx-0">Valida tu cuenta con cédula y código OTP.</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-200 sm:text-base lg:mx-0">Paso 1: ingresa tu cédula. Paso 2: verifica el código WhatsApp y crea tu nueva clave.</p>
          </section>

          {/* ── CARD ── */}
          <aside className="order-1 w-full min-w-0 max-w-[480px] justify-self-center lg:order-2 lg:justify-self-end lg:pr-8 xl:pr-12">
            <div className="relative rounded-2xl p-1 sm:p-1.5" style={{ boxShadow: "0 20px 60px rgba(3,6,18,0.7), 0 10px 30px rgba(255,122,0,0.14)" }}>
              <div className="rounded-2xl border-[2px]" style={{ borderColor: "rgba(255,122,0,0.95)" }}>
                <div className="relative overflow-hidden rounded-2xl p-4 sm:p-6" style={{ background: "rgba(6,10,28,0.92)", border: "1px solid rgba(255,122,0,0.12)" }}>

    

                  {/* Header */}
                  <div className="mb-4 flex items-center gap-3 sm:mb-5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#ffb347" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#ffb347" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="16" r="1" fill="#ffb347"/>
                    </svg>
                    <div>
                      <h3 className="text-base uppercase font-extrabold tracking-tight text-white sm:text-lg">Recuperar cuenta</h3>
                      <p className="text-[0.68rem] text-muted-foreground sm:text-xs">{stepSubtitle}</p>
                    </div>
                  </div>

                  {/* Stepper */}
                  {!success && (
                    <div className="mb-5 flex items-center gap-0">
                      {STEPS.map((item, index) => (
                        <div key={item.id} className="flex items-center" style={{ flex: index < STEPS.length - 1 ? "1" : "0" }}>
                          <div className="flex items-center gap-2">
                            <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-black transition-all ${
                              step > item.id ? "border-[#ff7a00] bg-[#ff7a00] text-white"
                              : step === item.id ? "border-[#ff7a00] text-[#ff7a00] shadow-[0_0_12px_rgba(255,122,0,0.3)]"
                              : "border-white/20 text-white/30"
                            }`}>
                              {step > item.id ? <CheckCircle2 size={14} /> : item.id}
                            </div>
                            <span className={`text-[0.62rem] font-bold uppercase tracking-wider ${
                              step > item.id ? "text-[#ff7a00]" : step === item.id ? "text-[#ffb347]" : "text-white/30"
                            }`}>{item.label}</span>
                          </div>
                          {index < STEPS.length - 1 && (
                            <div className={`mx-2 h-0.5 flex-1 rounded transition-all ${step > item.id ? "bg-[#ff7a00]" : "bg-white/10"}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="mb-4 rounded-lg border border-red-800 bg-red-950 p-3 text-center">
                      <p className="text-xs font-bold text-red-300">{error}</p>
                    </div>
                  )}

                  {/* Success */}
                  {success && (
                    <div className="py-6 text-center">
                      <div className="mb-3 text-4xl">✅</div>
                      <p className="text-sm font-bold text-green-400">¡Contraseña restablecida!</p>
                      <p className="mt-1 text-xs text-slate-400">Ya puedes iniciar sesión con tu nueva clave.</p>
                      <Link href="/login" className="mt-4 inline-block rounded-lg bg-gradient-to-r from-[#ff7a00] to-[#ffb347] px-6 py-2.5 text-sm font-bold text-white">
                        Ir a iniciar sesión
                      </Link>
                    </div>
                  )}

                  {/* ── STEP 1: Cédula ── */}
                  {!success && step === 1 && (
                    <>
                      <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground sm:mb-2 sm:text-xs">Cédula *</label>
                      <input
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        placeholder="1234567890"
                        inputMode="numeric"
                        maxLength={10}
                        className="mb-4 w-full rounded-md bg-[rgba(255,255,255,0.02)] px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground border border-[rgba(255,255,255,0.06)] focus:border-[#ff7a00]"
                      />
                      <Button type="button" size="lg" disabled={loading} onClick={handleSendCode}
                        className="w-full font-bold bg-gradient-to-r from-[#ff7a00] to-[#ffb347] text-white py-3">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</> : "ENVIAR CÓDIGO"}
                      </Button>
                    </>
                  )}

                  {/* ── STEP 2: Código ── */}
                  {!success && step === 2 && (
                    <>
                      <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground sm:mb-2 sm:text-xs">Código OTP (WhatsApp) *</label>
                      <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        inputMode="numeric"
                        maxLength={6}
                        className="mb-4 w-full rounded-md bg-[rgba(255,255,255,0.02)] px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground border border-[rgba(255,255,255,0.06)] focus:border-[#ff7a00] tracking-[0.4em] text-center text-lg font-bold"
                      />
                      <Button type="button" size="lg" disabled={!otp.trim() || loading} onClick={handleVerifyCode}
                        className="w-full font-bold bg-gradient-to-r from-[#ff7a00] to-[#ffb347] text-white py-3">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Validando...</> : "VALIDAR CÓDIGO"}
                      </Button>
                      <button type="button" onClick={() => { setStep(1); setError("") }}
                        className="mt-2.5 w-full rounded-lg border border-white/10 bg-transparent py-2.5 text-sm font-bold text-white/50 transition hover:border-white/30 hover:text-white/80">
                        ← Atrás
                      </button>
                    </>
                  )}

                  {/* ── STEP 3: Nueva contraseña ── */}
                  {!success && step === 3 && (
                    <>
                      <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground sm:mb-2 sm:text-xs">Nueva contraseña *</label>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="••••••••"
                        className="mb-3 w-full rounded-md bg-[rgba(255,255,255,0.02)] px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground border border-[rgba(255,255,255,0.06)] focus:border-[#ff7a00] sm:mb-4"
                      />
                      <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground sm:mb-2 sm:text-xs">Confirmar contraseña *</label>
                      <input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        placeholder="••••••••"
                        className="mb-4 w-full rounded-md bg-[rgba(255,255,255,0.02)] px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground border border-[rgba(255,255,255,0.06)] focus:border-[#ff7a00]"
                      />
                      <Button type="button" size="lg" disabled={loading} onClick={handleReset}
                        className="w-full font-bold bg-gradient-to-r from-[#ff7a00] to-[#ffb347] text-white py-3">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Restableciendo...</> : "CONFIRMAR Y RESTABLECER"}
                      </Button>
                      <button type="button" onClick={() => { setStep(2); setError("") }}
                        className="mt-2.5 w-full rounded-lg border border-white/10 bg-transparent py-2.5 text-sm font-bold text-white/50 transition hover:border-white/30 hover:text-white/80">
                        ← Atrás
                      </button>
                    </>
                  )}

                  {!success && (
                    <p className="mt-3.5 text-[0.72rem] text-muted-foreground sm:mt-4 sm:text-xs">
                      ¿Ya recuerdas tu contraseña?{" "}
                      <Link href="/login" className="font-bold text-white underline-offset-2 hover:underline">Inicia sesión</Link>
                    </p>
                  )}

                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── TICKER ── */}
      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-orange-400/70 bg-[#a84d00] overflow-hidden">
        <div className="ticker-wrap overflow-hidden whitespace-nowrap py-2 sm:py-2.5">
          <div className="ticker flex min-w-[200%] w-max items-center gap-4 pl-4 pr-4 text-[0.68rem] font-bold uppercase tracking-wide text-white sm:gap-6 sm:text-xs">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item.text}-${index}`} className="ticker-item inline-flex shrink-0 items-center gap-1.5 sm:gap-2">
                <span>{item.icon}</span><span>{item.text}</span><span className="sep text-orange-200/90">◆</span>
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}