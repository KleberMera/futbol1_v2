"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, ChevronDown } from "lucide-react"
import { showLoading, showError, showSuccess, showConfirm } from "@/lib/swal"

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

type Provincia = { ID: number; NOMBRE: string }
type Canton    = { ID: number; NOMBRE: string }
type Barrio    = { ID: number; NOMBRE: string }

type SelectOption = { ID: number; NOMBRE: string }

interface CustomSelectProps {
  value: number
  onChange: (val: number) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  loading?: boolean
}

function CustomSelect({
  value, onChange, options,
  placeholder = "— Selecciona —",
  disabled = false, loading = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.ID === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={() => !disabled && !loading && setOpen((o) => !o)}
        className={[
          "w-full rounded-md px-3 py-3 text-sm text-left flex items-center justify-between",
          "border transition-colors outline-none",
          "bg-[rgba(255,255,255,0.02)]",
          open ? "border-[#ff7a00]" : "border-[rgba(255,255,255,0.06)]",
          disabled || loading ? "cursor-not-allowed opacity-40" : "cursor-pointer",
        ].join(" ")}
      >
        <span className={selected ? "text-white" : "text-muted-foreground"}>
          {selected ? selected.NOMBRE : placeholder}
        </span>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#ff7a00] flex-shrink-0" />
        ) : (
          <ChevronDown className={`h-4 w-4 text-white/70 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        )}
      </button>

      {open && !disabled && (
        <div
          className="absolute left-0 right-0 z-50 mt-1 rounded-md border border-[rgba(255,122,0,0.3)] overflow-hidden"
          style={{
            background: "#0d1530",
            boxShadow: "0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,122,0,0.08)",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2.5 text-xs text-muted-foreground italic">Sin opciones disponibles</div>
          ) : (
            options.map((o) => (
              <button
                key={o.ID}
                type="button"
                onClick={() => { onChange(o.ID); setOpen(false) }}
                className={[
                  "w-full px-3 py-2.5 text-left text-sm transition-colors",
                  "hover:bg-[rgba(255,122,0,0.15)]",
                  o.ID === value
                    ? "bg-[rgba(255,122,0,0.12)] text-[#ffb347] font-semibold"
                    : "text-white",
                ].join(" ")}
              >
                {o.NOMBRE}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [verifyCode, setVerifyCode] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [formData, setFormData] = useState({
    cedula: "", nombres: "", apellidos: "",
    telefono: "", email: "", direccion: "",
  })
  const [provinciaId, setProvinciaId] = useState<number>(0)
  const [cantonId,    setCantonId]    = useState<number>(0)
  const [barrioId,    setBarrioId]    = useState<number>(0)

  const [provincias, setProvincias] = useState<Provincia[]>([])
  const [cantones,   setCantones]   = useState<Canton[]>([])
  const [barrios,    setBarrios]    = useState<Barrio[]>([])

  const [loadingProv, setLoadingProv] = useState(false)
  const [loadingCant, setLoadingCant] = useState(false)
  const [loadingBarr, setLoadingBarr] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState("")
  const [success,     setSuccess]     = useState(false)

  // ── Detecta redirección desde login por cuenta pendiente ──
  useEffect(() => {
    const pending = sessionStorage.getItem('pendingCedula')
    const params = new URLSearchParams(window.location.search)
    if (pending && params.get('step') === '3') {
      setFormData(f => ({ ...f, cedula: pending }))
      setStep(3)
      sessionStorage.removeItem('pendingCedula')
    }
  }, [])

  // ── Envía código automáticamente al entrar al step 3 ──
  useEffect(() => {
    if (step !== 3 || !formData.cedula) return
    fetch(`${API_BASE}/usuario/verify/resend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ CEDULA: formData.cedula }),
    }).catch(() => {})
  }, [step, formData.cedula])

  useEffect(() => {
    if (step !== 2) return
    setLoadingProv(true)
    fetch(`${API_BASE}/provincia`)
      .then((r) => r.json())
      .then((d) => setProvincias(d.data ?? d))
      .catch(() => setError("Error al cargar provincias"))
      .finally(() => setLoadingProv(false))
  }, [step])

  useEffect(() => {
    if (!provinciaId) { setCantones([]); setBarrios([]); return }
    setCantonId(0); setBarrioId(0)
    setCantones([]); setBarrios([])
    setLoadingCant(true)
    fetch(`${API_BASE}/canton/provincia/${provinciaId}`)
      .then((r) => r.json())
      .then((d) => setCantones(d.data ?? d))
      .catch(() => setError("Error al cargar cantones"))
      .finally(() => setLoadingCant(false))
  }, [provinciaId])

  useEffect(() => {
    if (!cantonId) { setBarrios([]); return }
    setBarrioId(0); setBarrios([])
    setLoadingBarr(true)
    fetch(`${API_BASE}/barrio/canton/${cantonId}`)
      .then((r) => r.json())
      .then((d) => setBarrios(d.data ?? d))
      .catch(() => setError("Error al cargar barrios"))
      .finally(() => setLoadingBarr(false))
  }, [cantonId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 1. Validar campos obligatorios
    if (!formData.cedula || !formData.nombres || !formData.apellidos || !formData.telefono) {
      const msg = "Completa todos los campos obligatorios"
      setError(msg)
      showError(msg)
      return
    }

    // 2. Validar longitud de cédula
    if (formData.cedula.length !== 10) {
      const msg = "La cédula debe tener exactamente 10 dígitos"
      setError(msg)
      showError(msg)
      return
    }

    // 3. Validar longitud de teléfono
    if (formData.telefono.length !== 10) {
      const msg = "El número de teléfono debe tener exactamente 10 dígitos"
      setError(msg)
      showError(msg)
      return
    }

    // 4. Confirmar teléfono para WhatsApp
    const confirm = await showConfirm(
      '¿Tu número es correcto?',
      `El código de activación se enviará por WhatsApp al: ${formData.telefono}. ¿Deseas continuar?`,
      'Sí, es correcto'
    )

    if (confirm.isConfirmed) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Solo requerimos Cantón y Barrio si la provincia seleccionada tiene opciones disponibles
    const hasOptions = cantones.length > 0
    if (!provinciaId || (hasOptions && (!cantonId || !barrioId)) || !formData.direccion) {
      const msg = !provinciaId 
        ? "Selecciona una provincia" 
        : hasOptions && (!cantonId || !barrioId)
          ? "Selecciona cantón y barrio"
          : "Ingresa tu dirección completa"
      setError(msg)
      showError(msg)
      return
    }

    const confirm = await showConfirm(
      '¿Registrar cuenta?',
      '¿Confirmas que tus datos son los correctos?',
      'Sí, registrar'
    )

    if (!confirm.isConfirmed) return

    setLoading(true)
    showLoading('Creando tu cuenta...')
    try {
      const res = await fetch(`${API_BASE}/usuario/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          CEDULA:      formData.cedula,
          NOMBRES:     formData.nombres,
          APELLIDOS:   formData.apellidos,
          TELEFONO:    formData.telefono,
          CORREO:       formData.email,
          DIRECCION:   formData.direccion,
          PROVINCIA_ID: provinciaId,
          CANTON_ID:    hasOptions ? cantonId : null,
          BARRIO_ID:    hasOptions ? barrioId : null,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        showSuccess('¡Registro casi completo! Por favor verifica tu código de verificación enviado a tu whatsapp.')
        setStep(3)
      } else {
        const msg = data.message || "Error al registrar usuario"
        setError(msg)
        showError(msg)
      }
    } catch {
      setError("Error de conexión con el servidor")
      showError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setVerifying(true)
    showLoading('Verificando código...')
    try {
      const res = await fetch(`${API_BASE}/usuario/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CEDULA: formData.cedula, CODE: verifyCode }),
      })
      const data = await res.json()
      if (res.ok) {
        showSuccess('¡Cuenta verificada con éxito!')
        setSuccess(true)
      } else {
        const msg = data.message || "Código incorrecto"
        setError(msg)
        showError(msg)
      }
    } catch {
      setError("Error de conexión")
      showError("Error de conexión")
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async () => {
    setError("")
    showLoading('Reenviando código...')
    try {
      const res = await fetch(`${API_BASE}/usuario/verify/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CEDULA: formData.cedula }),
      })
      const data = await res.json()
      if (res.ok) {
        showSuccess('Código reenviado con éxito')
      } else {
        const msg = data.message || "Error al reenviar"
        setError(msg)
        showError(msg)
      }
    } catch {
      setError("Error de conexión")
      showError("Error de conexión")
    }
  }

  const labelClass = "mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground"
  const inputClass = "w-full rounded-md bg-[rgba(255,255,255,0.02)] px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground border border-[rgba(255,255,255,0.06)] focus:border-[#ff7a00]"

  return (
    <div className="min-h-screen bg-background relative">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 border-b border-cyan-400/10 bg-[#07102d] text-white shadow-[0_2px_0_rgba(255,122,0,0.85)]">
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15 md:from-black/55 md:via-black/25 md:to-black/10" />
      </div>

      {/* ── MAIN ── */}
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-104px)] max-w-7xl items-center px-4 py-8 sm:min-h-[calc(100vh-64px)] sm:px-6 sm:py-10 lg:py-12">
        <div className="grid w-full items-center gap-6 sm:gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">

          {/* ── HERO ── */}
          <section className="order-2 mx-auto w-full max-w-md text-center text-white lg:order-1 lg:mx-0 lg:text-left">
            <p className="animate-glow-pulse mb-3 inline-flex items-center gap-2 rounded-full border border-yellow-400/50 bg-yellow-300/90 px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.16em] text-slate-900 shadow-[0_0_24px_rgba(255,204,0,0.35)] sm:px-3.5 sm:text-[0.72rem]">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.95)]" />
              </span>
              Regístrate y accede rápido
            </p>
            <h1 className="text-3xl font-black uppercase leading-[0.9] tracking-tight xs:text-4xl sm:text-5xl lg:text-[5rem]">Registro</h1>
            <p className="mt-4 max-w-sm text-base font-bold text-yellow-300 sm:mt-5 sm:text-xl lg:mx-0">Accede a la app en segundos con tu usuario.</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-200 sm:text-base lg:mx-0">Completa los datos obligatorios y crea tu cuenta en el concurso.</p>
          </section>

          {/* ── CARD ── */}
          <aside className="order-1 w-full min-w-0 max-w-[480px] justify-self-center lg:order-2 lg:justify-self-end lg:pr-8 xl:pr-12">
            <div className="relative rounded-2xl p-1 sm:p-1.5" style={{ boxShadow: "0 20px 60px rgba(3,6,18,0.7), 0 10px 30px rgba(255,122,0,0.14)" }}>
              <div className="rounded-2xl border-[2px]" style={{ borderColor: "rgba(255,122,0,0.95)" }}>
                <div className="relative overflow-hidden rounded-2xl p-4 sm:p-6" style={{ background: "rgba(6,10,28,0.92)", border: "1px solid rgba(255,122,0,0.12)" }}>

                  {/* Header */}
                  <div className="mb-4 flex items-center gap-3 sm:mb-5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                      <path d="M9 4V3h6v1a5 5 0 0 1 4 4v1a3 3 0 0 1-3 3h-1.5A4.5 4.5 0 0 1 10.5 16H9a3 3 0 0 1-3-3V8a5 5 0 0 1 4-4z" stroke="#ffb347" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M7 18h10v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1z" stroke="#ffb347" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                      <h3 className="text-base uppercase font-extrabold tracking-tight text-white sm:text-lg">Registro</h3>
                      <p className="text-[0.68rem] text-muted-foreground sm:text-xs">{step === 1 ? "Datos personales" : step === 2 ? "Ubicación" : "Verificación"}</p>
                    </div>
                  </div>

                  {/* Stepper */}
                  {!success && (
                    <div className="mb-5 flex items-center gap-0">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-black transition-all ${step === 1 ? "border-[#ff7a00] text-[#ff7a00] shadow-[0_0_12px_rgba(255,122,0,0.3)]" : "border-[#ff7a00] bg-[#ff7a00] text-white"}`}>
                          {step > 1 ? <CheckCircle2 size={14} /> : "1"}
                        </div>
                        <span className={`text-[0.62rem] font-bold uppercase tracking-wider ${step === 1 ? "text-[#ffb347]" : "text-[#ff7a00]"}`}>Personal</span>
                      </div>
                      <div className={`mx-2 h-0.5 flex-1 rounded transition-all ${step >= 2 ? "bg-[#ff7a00]" : "bg-white/10"}`} />
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-black transition-all ${step === 2 ? "border-[#ff7a00] text-[#ff7a00] shadow-[0_0_12px_rgba(255,122,0,0.3)]" : step > 2 ? "border-[#ff7a00] bg-[#ff7a00] text-white" : "border-white/20 text-white/30"}`}>
                          {step > 2 ? <CheckCircle2 size={14} /> : "2"}
                        </div>
                        <span className={`text-[0.62rem] font-bold uppercase tracking-wider ${step === 2 ? "text-[#ffb347]" : step > 2 ? "text-[#ff7a00]" : "text-white/30"}`}>Ubicación</span>
                      </div>
                      <div className={`mx-2 h-0.5 flex-1 rounded transition-all ${step === 3 ? "bg-[#ff7a00]" : "bg-white/10"}`} />
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-black transition-all ${step === 3 ? "border-[#ff7a00] text-[#ff7a00] shadow-[0_0_12px_rgba(255,122,0,0.3)]" : "border-white/20 text-white/30"}`}>3</div>
                        <span className={`text-[0.62rem] font-bold uppercase tracking-wider ${step === 3 ? "text-[#ffb347]" : "text-white/30"}`}>Verificar</span>
                      </div>
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
                      <div className="mb-3 text-4xl">🎉</div>
                      <p className="text-sm font-bold text-green-400">¡Cuenta activada con éxito!</p>
                      <p className="mt-1 text-xs text-slate-400">Ya puedes iniciar sesión con tu cédula</p>
                      <Link href="/login" className="mt-4 inline-block rounded-lg bg-gradient-to-r from-[#ff7a00] to-[#ffb347] px-6 py-2.5 text-sm font-bold text-white">
                        Ir a iniciar sesión
                      </Link>
                    </div>
                  )}

                  {/* ── STEP 1 ── */}
                  {!success && step === 1 && (
                    <form onSubmit={handleNext} noValidate>
                      <label className={labelClass}>Cédula *</label>
                      <input name="cedula" value={formData.cedula} onChange={handleChange}
                        placeholder="1234567890" inputMode="numeric" maxLength={10} required
                        className={`${inputClass} mb-3 sm:mb-4`} />

                      <div className="mb-3 grid grid-cols-2 gap-3 sm:mb-4">
                        <div>
                          <label className={labelClass}>Nombres *</label>
                          <input name="nombres" value={formData.nombres} onChange={handleChange}
                            placeholder="Tu nombre" required className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Apellidos *</label>
                          <input name="apellidos" value={formData.apellidos} onChange={handleChange}
                            placeholder="Tus apellidos" required className={inputClass} />
                        </div>
                      </div>

                      <label className={labelClass}>Correo electrónico</label>
                      <input name="email" value={formData.email} onChange={handleChange}
                        placeholder="tu@correo.com" type="email"
                        className={`${inputClass} mb-3 sm:mb-4`} />

                      <label className={labelClass}>Número de celular *</label>
                      <input name="telefono" value={formData.telefono} onChange={handleChange}
                        placeholder="0991234567" inputMode="tel" maxLength={10} required
                        className={`${inputClass} mb-4`} />

                      <Button type="submit" size="lg" className="w-full font-bold bg-gradient-to-r from-[#ff7a00] to-[#ffb347] text-white py-3">
                        Siguiente →
                      </Button>
                      <p className="mt-3.5 text-[0.72rem] text-muted-foreground sm:mt-4 sm:text-xs">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="font-bold text-white underline-offset-2 hover:underline">Inicia sesión</Link>
                      </p>
                    </form>
                  )}

                  {/* ── STEP 2 ── */}
                  {!success && step === 2 && (
                    <form onSubmit={handleSubmit} noValidate>
                      <label className={labelClass}>Provincia *</label>
                      <div className="mb-3 sm:mb-4">
                        <CustomSelect value={provinciaId} onChange={setProvinciaId}
                          options={provincias} placeholder="— Selecciona una provincia —"
                          disabled={loadingProv} loading={loadingProv} />
                      </div>

                      {!(provinciaId !== 0 && !loadingCant && cantones.length === 0) && (
                        <>
                          <label className={labelClass}>Cantón *</label>
                          <div className="mb-3 sm:mb-4">
                            <CustomSelect value={cantonId} onChange={setCantonId}
                              options={cantones} placeholder="— Selecciona un cantón —"
                              disabled={!provinciaId || loadingCant} loading={loadingCant} />
                          </div>

                          <label className={labelClass}>Barrio *</label>
                          <div className="mb-3 sm:mb-4">
                            <CustomSelect value={barrioId} onChange={setBarrioId}
                              options={barrios} placeholder="— Selecciona un barrio —"
                              disabled={!cantonId || loadingBarr} loading={loadingBarr} />
                          </div>
                        </>
                      )}

                      <label className={labelClass}>Dirección *</label>
                      <input name="direccion" value={formData.direccion} onChange={handleChange}
                        placeholder="Tu dirección completa" required
                        className={`${inputClass} mb-4`} />

                      <button type="button" onClick={() => { setStep(1); setError("") }}
                        className="mb-2.5 w-full rounded-lg border border-white/10 bg-transparent py-2.5 text-sm font-bold text-white/50 transition hover:border-white/30 hover:text-white/80">
                        ← Atrás
                      </button>

                      <Button type="submit" size="lg" disabled={loading}
                        className="w-full font-bold bg-gradient-to-r from-[#ff7a00] to-[#ffb347] text-white py-3">
                        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registrando...</> : "CREAR CUENTA"}
                      </Button>

                      <p className="mt-3.5 text-[0.72rem] text-muted-foreground sm:mt-4 sm:text-xs">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="font-bold text-white underline-offset-2 hover:underline">Inicia sesión</Link>
                      </p>
                    </form>
                  )}

                  {/* ── STEP 3 ── */}
                  {!success && step === 3 && (
                    <form onSubmit={handleVerify} noValidate>
                      <div className="mb-5 text-center">
                        <div className="text-3xl mb-2">📱</div>
                        <p className="text-sm text-slate-300">
                          Te enviamos un código de 6 dígitos a tu WhatsApp.<br />
                          Ingrésalo para activar tu cuenta.
                        </p>
                      </div>

                      <label className={labelClass}>Código de verificación *</label>
                      <input
                        value={verifyCode}
                        onChange={e => setVerifyCode(e.target.value)}
                        placeholder="000000"
                        inputMode="numeric"
                        maxLength={6}
                        required
                        className={`${inputClass} mb-3 text-center text-2xl tracking-[0.5em]`}
                      />

                      <button
                        type="button"
                        onClick={handleResend}
                        className="mb-4 w-full text-xs text-slate-400 underline-offset-2 hover:text-[#ffb347] hover:underline transition-colors"
                      >
                        ¿No recibiste el código? Reenviar →
                      </button>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={verifyCode.length < 6 || verifying}
                        className="w-full font-bold bg-gradient-to-r from-[#ff7a00] to-[#ffb347] text-white py-3"
                      >
                        {verifying
                          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verificando...</>
                          : "✅ VERIFICAR CUENTA"
                        }
                      </Button>
                    </form>
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