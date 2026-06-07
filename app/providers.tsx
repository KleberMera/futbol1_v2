'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

interface Usuario {
  ID: number
  ROL: string
  ROL_ID: number
  CEDULA: string
  NOMBRES: string
  APELLIDOS: string
  TELEFONO: string
  DIRECCION: string
  PROVINCIA: string
  CANTON: string
  BARRIO: string
  PROVINCIA_ID: number | null
  CANTON_ID: number | null
  BARRIO_ID: number | null
  FECHA_REGISTRO: string
  ESTADO: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: Usuario | null
  login: (cedula: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const BASE = '/futbolv2' 
//const BASE = ' '
const ADMIN_ROLES = ['ADMINISTRADOR']
const isAdminRole = (role?: string, roleId?: number) => {
  if (roleId === 1) return true
  return !!role && ADMIN_ROLES.includes(role.trim().toUpperCase())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<Usuario | null>(null)
  const pathname = usePathname()

  // Leer localStorage al montar
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const userData: Usuario = JSON.parse(storedUser)
        if (userData?.ID && userData?.ROL) {
          setUser(userData)
          setIsAuthenticated(true)
          return
        }
      }
      setIsAuthenticated(false)
    } catch (error) {
      localStorage.removeItem('user')
      setIsAuthenticated(false)
    }
  }, [])

  // Protección de rutas
  useEffect(() => {
    if (isAuthenticated === null) return

    const publicPages = ['/login', '/register', '/reset-password']
    const adminPages = ['/admin', '/reporting', '/whatsapp-qr']
    const isPublicPage = publicPages.some((path) => pathname.startsWith(path))
    const isAdminPage = adminPages.some((path) => pathname.startsWith(path))
    const isAdmin = isAdminRole(user?.ROL, user?.ROL_ID)

    if (!isAuthenticated && !isPublicPage) {
      window.location.href = `${BASE}/login`
      return
    }

    if (isAuthenticated && isAdminPage && !isAdmin) {
      window.location.href = `${BASE}/`
    }
  }, [isAuthenticated, pathname, user?.ROL])

const login = async (cedula: string, password: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL

    const response = await fetch(`${API_BASE}/usuario/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CEDULA: cedula, PASSWORD: password }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      // cuenta pendiente de activación — redirigir al paso 3
if (data?.message === 'CUENTA_PENDIENTE') {
  sessionStorage.setItem('pendingCedula', cedula)
  window.location.href = `${BASE}/register?step=3`
  throw new Error('REDIRIGIENDO')
}
      throw new Error(data?.message || 'Credenciales incorrectas')
    }

    const userData: Usuario = data.data

    if (!userData?.ID || !userData?.ROL) {
      throw new Error('Respuesta inválida del servidor')
    }

    const token = data.token || `token_${cedula}_${Date.now()}`

    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('auth_token', token)
    document.cookie = `auth_token=${token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`

    setUser(userData)
    setIsAuthenticated(true)

    if (isAdminRole(userData.ROL)) {
      window.location.href = `${BASE}/admin`
    } else {
      window.location.href = `${BASE}/`
    }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('auth_token')
    document.cookie = 'auth_token=; path=/; max-age=0; SameSite=Lax'
    setUser(null)
    setIsAuthenticated(false)
    window.location.href = `${BASE}/login`
  }

  if (isAuthenticated === null) return null

  return (
    <AuthContext.Provider value={{
      isAuthenticated: isAuthenticated ?? false,
      user,
      login,
      logout,
      isLoading: false
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}