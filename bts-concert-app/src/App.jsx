import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import AppShell from './components/AppShell.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import TicketDetailPage from './pages/TicketDetailPage.jsx'
import TicketsPage from './pages/TicketsPage.jsx'
import TransferEmailPage from './pages/TransferEmailPage.jsx'
import TransferMethodPage from './pages/TransferMethodPage.jsx'
import TransferSelectPage from './pages/TransferSelectPage.jsx'

/**
 * En local usamos rutas normales (/tickets). Para publicar el build en un
 * hosting estático que no reescribe rutas (o bajo una subcarpeta) se compila
 * con VITE_ROUTER=hash y las rutas pasan a ser /#/tickets.
 */
const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : BrowserRouter

/**
 * Árbol de la aplicación.
 *
 *  ThemeProvider   -> modo claro/oscuro
 *    ToastProvider -> notificaciones flotantes
 *      AuthProvider-> sesión persistida en localStorage
 *        Router    -> ruta pública (/login) y privadas (/tickets/...)
 *          DataProvider -> datos del evento y entradas (solo tras autenticarse)
 *
 * La app se reduce a la sección de entradas: no hay Inicio ni Perfil.
 */
export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />

              <Route
                element={
                  <ProtectedRoute>
                    <DataProvider>
                      <AppShell />
                    </DataProvider>
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/tickets" replace />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/tickets/:eventId" element={<TicketDetailPage />} />
                <Route
                  path="/tickets/:eventId/transferir"
                  element={<TransferSelectPage />}
                />
                <Route
                  path="/tickets/:eventId/transferir/metodo"
                  element={<TransferMethodPage />}
                />
                <Route
                  path="/tickets/:eventId/transferir/email"
                  element={<TransferEmailPage />}
                />
              </Route>

              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
