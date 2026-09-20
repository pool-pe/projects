import { useState } from 'react'
import { Bell, LogOut, UserRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { cn, formatDateTime } from '../lib/format.js'
import Modal from './ui/Modal.jsx'

/**
 * Cabecera de la pantalla "Mis Entradas".
 *
 * Réplica medida pixel a pixel sobre la captura de la app original
 * (1080 px de ancho, densidad ~2.77 => 390 px CSS):
 *   - título 23 px bold
 *   - botones de 52×52 con radio 16 e icono de 18 px (#98a1a3)
 *   - control segmentado de 60 px de alto, radio 14, pista #081410
 *   - píldora activa de 46 px de alto y radio 8, blanca con texto 16 px
 *   - hairline #1b2327 justo debajo
 */
export function MyTicketsHeader({ tab, onTabChange }) {
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markNotificationsRead } = useData()
  const toast = useToast()
  const [panel, setPanel] = useState(null) // 'bell' | 'account' | null

  const TABS = [
    { id: 'proximos', label: 'Próximos' },
    { id: 'pasados', label: 'Pasados' },
  ]

  function openBell() {
    markNotificationsRead()
    setPanel('bell')
  }

  function handleLogout() {
    setPanel(null)
    logout()
    toast.info('Sesión cerrada')
  }

  return (
    <>
      <header className="safe-top sticky top-0 z-40 border-b border-app-line bg-app-bg">
        <div className="px-4">
          {/* Fila del título */}
          <div className="flex h-[52px] items-center justify-between gap-3">
            <h1 className="truncate text-[23px] font-bold leading-none tracking-[-0.01em] text-white">
              Mis Entradas
            </h1>

            <div className="flex shrink-0 items-center gap-[6px]">
              <IconButton
                label={`Notificaciones${unreadCount ? `: ${unreadCount} sin leer` : ''}`}
                onClick={openBell}
              >
                <Bell className="size-[18px]" aria-hidden="true" />
              </IconButton>

              <IconButton label="Mi cuenta" onClick={() => setPanel('account')}>
                <UserRound className="size-[18px]" aria-hidden="true" />
              </IconButton>
            </div>
          </div>

          {/* Control segmentado */}
          <div
            role="tablist"
            aria-label="Filtro de entradas"
            className="mt-[14px] flex h-[60px] w-full items-stretch rounded-[14px] bg-app-track px-[5px] py-[7px]"
          >
            {TABS.map(({ id, label }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onTabChange(id)}
                  className={cn(
                    'flex flex-1 items-center justify-center rounded-[8px] transition-colors duration-200',
                    active ? 'bg-white' : 'bg-transparent',
                  )}
                >
                  {/* En la app original la pestaña inactiva no muestra texto:
                      solo se ve la etiqueta de la pestaña activa. Mantenemos el
                      nombre accesible para lectores de pantalla. */}
                  <span
                    className={cn(
                      active
                        ? 'text-[16px] font-bold leading-none text-[#070707]'
                        : 'sr-only',
                    )}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="h-[2px]" />
        </div>
      </header>

      {/* Notificaciones */}
      <Modal
        open={panel === 'bell'}
        onClose={() => setPanel(null)}
        title="Notificaciones"
        size="sm"
      >
        {notifications.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-700/60 dark:text-ink-100/50">
            No tienes notificaciones.
          </p>
        ) : (
          <ul className="divide-y divide-brand-100 dark:divide-white/10">
            {notifications.map((item) => (
              <li key={item.id} className="py-3">
                <p className="text-sm font-semibold text-ink-900 dark:text-white">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-700/70 dark:text-ink-100/60">
                  {item.body}
                </p>
                <p className="mt-1 text-[11px] text-ink-700/45 dark:text-ink-100/35">
                  {formatDateTime(item.date)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Cuenta */}
      <Modal
        open={panel === 'account'}
        onClose={() => setPanel(null)}
        title={user?.fullName ?? user?.name ?? 'Mi cuenta'}
        description={user?.email}
        size="sm"
      >
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
        >
          <LogOut className="size-4.5" aria-hidden="true" />
          Cerrar sesión
        </button>
      </Modal>
    </>
  )
}

function IconButton({ children, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-[52px] place-items-center rounded-[16px] bg-app-surface text-app-icon transition-colors active:bg-white/10"
    >
      {children}
    </button>
  )
}

export default MyTicketsHeader
