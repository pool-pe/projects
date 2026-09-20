import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { getBackendStatus } from '../lib/api.js'
import { useAuth } from './AuthContext.jsx'

const DataContext = createContext(null)

/**
 * Entradas ya transferidas. Se guardan en el navegador para que la lista siga
 * vacía al recargar: una entrada transferida deja de ser tuya.
 */
const TRANSFERRED_KEY = 'bts.transferred'

function readTransferred() {
  try {
    const raw = localStorage.getItem(TRANSFERRED_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function persistTransferred(ids) {
  try {
    localStorage.setItem(TRANSFERRED_KEY, JSON.stringify([...ids]))
  } catch {
    /* almacenamiento bloqueado: el cambio dura lo que la pestaña */
  }
}

/**
 * Carga (una sola vez, al autenticarse) todo lo que necesita el dashboard:
 * evento destacado, entradas, historial de compras, guía y notificaciones.
 */
export function DataProvider({ children }) {
  const { isAuthenticated, token, user } = useAuth()

  const [transferred, setTransferred] = useState(readTransferred)
  const [state, setState] = useState({
    loading: true,
    error: null,
    event: null,
    tickets: [],
    purchases: [],
    guide: [],
    notifications: [],
  })

  const load = useCallback(async () => {
    if (!isAuthenticated) return
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await api.bootstrap(token, user)
      setState({
        loading: false,
        error: null,
        event: data.event,
        tickets: data.tickets ?? [],
        purchases: data.purchases ?? [],
        guide: data.guide ?? [],
        notifications: data.notifications ?? [],
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message || 'No se pudieron cargar los datos.',
      }))
    }
  }, [isAuthenticated, token, user])

  useEffect(() => {
    if (isAuthenticated) load()
  }, [isAuthenticated, load])

  /** Marca entradas como transferidas: desaparecen de la lista. */
  const transferTickets = useCallback((ids) => {
    setTransferred((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      persistTransferred(next)
      return next
    })
  }, [])

  /** Devuelve todas las entradas a la cuenta (útil para reiniciar la demo). */
  const restoreTickets = useCallback(() => {
    setTransferred(() => {
      persistTransferred(new Set())
      return new Set()
    })
  }, [])

  const markNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
    }))
  }, [])

  const value = useMemo(() => {
    const tickets = state.tickets.filter((ticket) => !transferred.has(ticket.id))

    return {
      ...state,
      /** Solo las entradas que siguen siendo tuyas. */
      tickets,
      /** Todas, incluidas las transferidas (para poder restaurarlas). */
      allTickets: state.tickets,
      transferredCount: state.tickets.length - tickets.length,
      unreadCount: state.notifications.filter((n) => n.unread).length,
      /** true = API Express respondiendo, false = modo demo local */
      backendOnline: getBackendStatus(),
      reload: load,
      transferTickets,
      restoreTickets,
      markNotificationsRead,
      getTicketById: (id) => tickets.find((ticket) => ticket.id === id) ?? null,
    }
  }, [state, transferred, load, transferTickets, restoreTickets, markNotificationsRead])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData debe usarse dentro de <DataProvider>')
  return context
}

export default DataContext
