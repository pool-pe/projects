import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import api, { getBackendStatus } from '../lib/api.js'
import { useAuth } from './AuthContext.jsx'

const DataContext = createContext(null)

/**
 * Carga (una sola vez, al autenticarse) todo lo que necesita el dashboard:
 * evento destacado, entradas, historial de compras, guía y notificaciones.
 */
export function DataProvider({ children }) {
  const { isAuthenticated, token, user } = useAuth()

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

  const markNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
    }))
  }, [])

  const value = useMemo(
    () => ({
      ...state,
      /** Entrada principal del usuario (la que se muestra en el Home). */
      primaryTicket: state.tickets[0] ?? null,
      unreadCount: state.notifications.filter((n) => n.unread).length,
      /** true = API Express respondiendo, false = modo demo local */
      backendOnline: getBackendStatus(),
      reload: load,
      markNotificationsRead,
      getTicketById: (id) => state.tickets.find((ticket) => ticket.id === id) ?? null,
    }),
    [state, load, markNotificationsRead],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData debe usarse dentro de <DataProvider>')
  return context
}

export default DataContext
