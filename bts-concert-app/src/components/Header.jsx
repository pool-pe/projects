import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Ticket as TicketIcon,
  User,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { cn, formatDateTime, getGreeting } from '../lib/format.js'
import Avatar from './ui/Avatar.jsx'
import ThemeToggle from './ThemeToggle.jsx'

/**
 * Barra superior responsive: avatar + saludo + notificaciones + ajustes +
 * menú de usuario con cierre de sesión.
 */
export function Header() {
  const { user, logout } = useAuth()
  const { notifications, unreadCount, markNotificationsRead, backendOnline, event } = useData()
  const toast = useToast()

  const [openPanel, setOpenPanel] = useState(null) // 'bell' | 'user' | null
  const headerRef = useRef(null)

  // Cierra los popovers al hacer click fuera o pulsar Escape.
  useEffect(() => {
    if (!openPanel) return undefined

    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpenPanel(null)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpenPanel(null)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [openPanel])

  const displayName = user?.name ?? 'ARMY'

  function handleLogout() {
    setOpenPanel(null)
    logout()
    toast.info('Sesión cerrada', {
      description: `¡Nos vemos en el ${event?.venue ?? 'concierto'}!`,
    })
  }

  function toggle(panel) {
    setOpenPanel((prev) => {
      const next = prev === panel ? null : panel
      if (next === 'bell') markNotificationsRead()
      return next
    })
  }

  return (
    <header
      ref={headerRef}
      className="glass safe-top sticky top-0 z-50 border-x-0 border-t-0"
    >
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Identidad del usuario */}
        <Link to="/perfil" className="flex min-w-0 items-center gap-3 rounded-xl">
          <Avatar name={user?.fullName ?? displayName} size="md" />
          <div className="min-w-0">
            <p className="truncate text-xs text-ink-700/60 dark:text-ink-100/50">
              {getGreeting()},
            </p>
            <p className="truncate font-display text-[15px] font-bold leading-tight text-ink-900 dark:text-white">
              {displayName}
            </p>
          </div>
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Estado de la API (útil al desarrollar) */}
          <span
            title={
              backendOnline
                ? 'Conectado a la API Express (localhost:4000)'
                : 'Modo demo local (sin backend)'
            }
            className={cn(
              'hidden items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold sm:inline-flex',
              backendOnline
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
            )}
          >
            {backendOnline ? (
              <Wifi className="size-3.5" aria-hidden="true" />
            ) : (
              <WifiOff className="size-3.5" aria-hidden="true" />
            )}
            {backendOnline ? 'API' : 'Demo'}
          </span>

          <ThemeToggle />

          {/* Notificaciones */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('bell')}
              aria-label={`Notificaciones${unreadCount ? `: ${unreadCount} sin leer` : ''}`}
              aria-expanded={openPanel === 'bell'}
              className={cn(
                'relative grid size-10 place-items-center rounded-xl border transition',
                'border-brand-200 bg-white/80 text-ink-700 hover:border-brand-400 hover:text-brand-600',
                'dark:border-white/10 dark:bg-white/5 dark:text-ink-100 dark:hover:border-brand-400/50',
                openPanel === 'bell' && 'border-brand-500 text-brand-600 dark:border-brand-400',
              )}
            >
              <Bell className="size-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-ink-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {openPanel === 'bell' && (
              <Popover title="Notificaciones">
                <ul className="divide-y divide-brand-100 dark:divide-white/10">
                  {notifications.length === 0 && (
                    <li className="px-4 py-6 text-center text-sm text-ink-700/60 dark:text-ink-100/50">
                      No tienes notificaciones.
                    </li>
                  )}
                  {notifications.map((item) => (
                    <li key={item.id} className="px-4 py-3">
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
              </Popover>
            )}
          </div>

          {/* Menú de usuario (oculto en móvil: allí manda la barra inferior) */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              onClick={() => toggle('user')}
              aria-expanded={openPanel === 'user'}
              aria-label="Menú de cuenta"
              className={cn(
                'flex h-10 items-center gap-1.5 rounded-xl border px-2.5 transition',
                'border-brand-200 bg-white/80 text-ink-700 hover:border-brand-400',
                'dark:border-white/10 dark:bg-white/5 dark:text-ink-100 dark:hover:border-brand-400/50',
                openPanel === 'user' && 'border-brand-500 dark:border-brand-400',
              )}
            >
              <Settings className="size-5" aria-hidden="true" />
              <ChevronDown
                className={cn(
                  'size-4 transition-transform duration-200',
                  openPanel === 'user' && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>

            {openPanel === 'user' && (
              <Popover title={user?.fullName ?? displayName} subtitle={user?.email}>
                <nav className="p-2">
                  <MenuLink to="/perfil" icon={User} onClick={() => setOpenPanel(null)}>
                    Mi perfil
                  </MenuLink>
                  <MenuLink to="/tickets" icon={TicketIcon} onClick={() => setOpenPanel(null)}>
                    Mis entradas
                  </MenuLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <LogOut className="size-4.5" aria-hidden="true" />
                    Cerrar sesión
                  </button>
                </nav>
              </Popover>
            )}
          </div>

          {/* Botón directo de salir en móvil */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="grid size-10 place-items-center rounded-xl border border-brand-200 bg-white/80 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 dark:border-white/10 dark:bg-white/5 dark:text-rose-400 dark:hover:border-rose-400/40 sm:hidden"
          >
            <LogOut className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}

function Popover({ title, subtitle, children }) {
  return (
    <div className="absolute right-0 top-12 z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-2xl shadow-brand-900/15 dark:border-white/10 dark:bg-ink-900 dark:shadow-black/50">
      <div className="border-b border-brand-100 px-4 py-3 dark:border-white/10">
        <p className="font-display text-sm font-bold text-ink-900 dark:text-white">{title}</p>
        {subtitle && (
          <p className="truncate text-xs text-ink-700/60 dark:text-ink-100/50">{subtitle}</p>
        )}
      </div>
      <div className="max-h-80 overflow-y-auto">{children}</div>
    </div>
  )
}

function MenuLink({ to, icon: Icon, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-900 transition hover:bg-brand-100/70 dark:text-ink-100 dark:hover:bg-white/10"
    >
      <Icon className="size-4.5 text-brand-500" aria-hidden="true" />
      {children}
    </Link>
  )
}

export default Header
