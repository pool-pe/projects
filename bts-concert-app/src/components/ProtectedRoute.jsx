import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Envuelve las rutas privadas.
 * Mientras se rehidrata la sesión desde localStorage muestra un loader,
 * así evitamos el parpadeo "login -> dashboard" al recargar la página.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isChecking } = useAuth()
  const location = useLocation()

  if (isChecking) {
    return (
      <div className="grid min-h-dvh place-items-center bg-brand-50 dark:bg-ink-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-brand-500" aria-hidden="true" />
          <p className="text-sm font-medium text-ink-700/60 dark:text-ink-100/50">
            Cargando tu sesión…
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
