import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import api from '../lib/api.js'

const SESSION_KEY = 'bts.session'

const AuthContext = createContext(null)

/**
 * Estados posibles:
 *  - 'checking'      -> aún leyendo localStorage (evita parpadeo del login)
 *  - 'authenticated' -> hay usuario en sesión
 *  - 'guest'         -> no hay sesión
 */
export function AuthProvider({ children }) {
  const [status, setStatus] = useState('checking')
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  // 1. Rehidratación de la sesión guardada.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      if (raw) {
        const session = JSON.parse(raw)
        if (session?.user && session?.token) {
          setUser(session.user)
          setToken(session.token)
          setStatus('authenticated')
          return
        }
      }
    } catch {
      /* sesión corrupta: la descartamos */
    }
    setStatus('guest')
  }, [])

  const persist = useCallback((nextUser, nextToken) => {
    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ user: nextUser, token: nextToken, savedAt: Date.now() }),
      )
    } catch {
      /* almacenamiento bloqueado: la sesión dura lo que la pestaña */
    }
  }, [])

  /** Envuelve login/register/social con manejo uniforme de carga y error. */
  const runAuth = useCallback(
    async (operation) => {
      setIsSubmitting(true)
      setError(null)
      try {
        const { user: nextUser, token: nextToken } = await operation()
        if (!mounted.current) return nextUser
        setUser(nextUser)
        setToken(nextToken)
        setStatus('authenticated')
        persist(nextUser, nextToken)
        return nextUser
      } catch (err) {
        if (mounted.current) setError(err.message || 'Ocurrió un error inesperado.')
        throw err
      } finally {
        if (mounted.current) setIsSubmitting(false)
      }
    },
    [persist],
  )

  const login = useCallback(
    (credentials) => runAuth(() => api.login(credentials)),
    [runAuth],
  )

  const register = useCallback((data) => runAuth(() => api.register(data)), [runAuth])

  const socialLogin = useCallback(
    (provider) => runAuth(() => api.socialLogin(provider)),
    [runAuth],
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    setStatus('guest')
    setError(null)
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignoramos */
    }
  }, [])

  /** Actualiza el perfil en memoria + almacenamiento (preferencias, datos, etc.). */
  const updateUser = useCallback(
    (patch) => {
      setUser((prev) => {
        if (!prev) return prev
        const next = { ...prev, ...patch }
        persist(next, token)
        return next
      })
    },
    [persist, token],
  )

  const updatePreferences = useCallback(
    async (preferences) => {
      const merged = { ...user?.preferences, ...preferences }
      updateUser({ preferences: merged })
      try {
        await api.updatePreferences(token, merged)
      } catch {
        /* en modo demo no pasa nada: el cambio ya está aplicado localmente */
      }
      return merged
    },
    [token, updateUser, user?.preferences],
  )

  const clearError = useCallback(() => setError(null), [])

  const value = useMemo(
    () => ({
      status,
      isAuthenticated: status === 'authenticated',
      isChecking: status === 'checking',
      user,
      token,
      error,
      isSubmitting,
      login,
      register,
      socialLogin,
      logout,
      updateUser,
      updatePreferences,
      clearError,
    }),
    [
      status,
      user,
      token,
      error,
      isSubmitting,
      login,
      register,
      socialLogin,
      logout,
      updateUser,
      updatePreferences,
      clearError,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return context
}

export default AuthContext
