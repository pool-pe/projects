import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import Dashboard from './components/Dashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import TicketsPage from './pages/TicketsPage.jsx'

/**
 * Árbol de la aplicación.
 *
 *  ThemeProvider   -> modo claro/oscuro
 *    ToastProvider -> notificaciones flotantes
 *      AuthProvider-> sesión persistida en localStorage
 *        Router    -> rutas públicas (/login) y privadas (/, /tickets, /perfil)
 *          DataProvider -> datos del evento y entradas (solo tras autenticarse)
 */
export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                element={
                  <ProtectedRoute>
                    <DataProvider>
                      <Dashboard />
                    </DataProvider>
                  </ProtectedRoute>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/perfil" element={<ProfilePage />} />
              </Route>

              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
