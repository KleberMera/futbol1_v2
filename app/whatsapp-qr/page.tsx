"use client"

import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { SiteHeader } from "@/components/site-header"
import { RefreshCw, CheckCircle2, XCircle, Loader2, LogOut } from "lucide-react"
import { showLoading, showError, showSuccess, showConfirm } from "@/lib/swal"

interface WhatsAppStatus {
  connected: boolean
  hasQr: boolean
  user: string | null
}

interface WhatsAppQRResponse {
  connected: boolean
  qr: string
}

export default function WhatsAppQRPage() {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null)
  const [qrData, setQrData] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_WSP_URL ?? "https://whatsapprest.onrender.com"

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/whatsapp/status`)
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Error fetching status:", error)
    }
  }

  const fetchQR = async () => {
    try {
      const response = await fetch(`${API_BASE}/whatsapp/qr`)
      const data: WhatsAppQRResponse = await response.json()
      if (data.qr) {
        setQrData(data.qr)
      }
    } catch (error) {
      console.error("Error fetching QR:", error)
    }
  }

  const refreshAll = async () => {
    setRefreshing(true)
    await Promise.all([fetchStatus(), fetchQR()])
    setRefreshing(false)
  }

  const handleLogout = async () => {
    const confirm = await showConfirm(
      '¿Cerrar sesión de WhatsApp?',
      'Se desconectará el dispositivo actual.',
      'Sí, cerrar sesión'
    )

    if (!confirm.isConfirmed) return

    showLoading('Cerrando sesión...')
    try {
      const response = await fetch(`${API_BASE}/whatsapp/logout`, {
        method: "POST",
      })
      if (response.ok) {
        setStatus({ connected: false, hasQr: false, user: null })
        setQrData(null)
        await fetchStatus()
        await fetchQR()
        showSuccess('Sesión cerrada correctamente')
      } else {
        showError('Error al cerrar sesión')
      }
    } catch (error) {
      console.error("Error logging out:", error)
      showError('Error de conexión')
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchStatus(), fetchQR()])
      setLoading(false)
    }

    loadData()

    // Poll status every 5 seconds
    const interval = setInterval(fetchStatus, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Conectar WhatsApp</h1>
              <p className="mt-2 text-muted-foreground">
                Escanea el código QR para conectar tu WhatsApp con Baileys
              </p>
            </div>
            <button
              onClick={refreshAll}
              disabled={refreshing}
              className="rounded-lg border border-input bg-background p-2 hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              {refreshing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Status Card */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : status?.connected ? (
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <div>
                <p className="font-semibold">
                  {loading
                    ? "Verificando estado..."
                    : status?.connected
                    ? "WhatsApp conectado"
                    : "WhatsApp no conectado"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {status?.hasQr
                    ? "Código QR disponible para escanear"
                    : "Esperando código QR..."}
                </p>
              </div>
            </div>
          </div>

          {/* QR Code */}
          {qrData && !status?.connected && (
            <div className="rounded-lg border bg-card p-8 shadow-sm">
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-lg bg-white p-4">
                  <QRCodeCanvas
                    value={qrData}
                    size={256}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Instrucciones:</p>
                  <ol className="text-sm text-muted-foreground space-y-1 text-left">
                    <li>1. Abre WhatsApp en tu teléfono</li>
                    <li>2. Ve a Configuración → Dispositivos vinculados</li>
                    <li>3. Toca "Vincular un dispositivo"</li>
                    <li>4. Escanea este código QR</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Connected State */}
          {status?.connected && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-950">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold text-green-900 dark:text-green-100">
                ¡Conectado exitosamente!
              </h2>
              <p className="mt-2 text-green-700 dark:text-green-300">
                Tu WhatsApp está conectado y listo para usar.
              </p>
              <button
                onClick={handleLogout}
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && !qrData && (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-12 shadow-sm">
              <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Cargando código QR...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
