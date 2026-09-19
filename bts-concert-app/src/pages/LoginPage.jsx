import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Login from '../components/Login.jsx'

/**
 * Ruta pública /login.
 * Si ya hay sesión activa, redirige al dashboard (o a la ruta que el usuario
 * intentaba abrir antes de autenticarse).
 */
export function LoginPage() {
  const { isAuthenticated, isChecking } = useAuth()
  const location = useLocation()

  if (isChecking) return null
  if (isAuthenticated) return <Navigate to={location.state?.from ?? '/'} replace />

  return <Login />
}

export default LoginPage
