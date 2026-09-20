import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { House, Ticket, UserRound } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { cn } from '../lib/format.js'
import Header from './Header.jsx'
import BottomNav from './BottomNav.jsx'
import { DashboardSkeleton } from './ui/Skeleton.jsx'
import Button from './ui/Button.jsx'

const TABS = [
  { to: '/', label: 'Inicio', icon: House, end: true },
  { to: '/tickets', label: 'Mis Tickets', icon: Ticket },
  { to: '/perfil', label: 'Perfil', icon: UserRound },
]

/**
 * Layout de la zona privada: header fijo arriba, contenido con scroll,
 * navegación inferior en móvil y pestañas horizontales en escritorio.
 *
 * Las rutas /tickets son réplicas de la app original: traen su propia cabecera
 * y su propio espaciado, así que el layout se aparta (modo `bare`).
 */
export function Dashboard() {
  const { loading, error, reload } = useData()
  const { pathname } = useLocation()
  const bare = pathname.startsWith('/tickets')
  // Las pantallas apiladas (detalle, transferencia) no llevan barra inferior:
  // se sale de ellas con la flecha de retroceso, igual que en la app original.
  const pushed = /^\/tickets\/.+/.test(pathname)

  let content
  if (error) {
    content = (
      <div className="rounded-card border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-400/25 dark:bg-rose-500/10">
        <p className="font-display text-lg font-bold text-rose-800 dark:text-rose-200">
          No pudimos cargar tus datos
        </p>
        <p className="mt-1 text-sm text-rose-700/80 dark:text-rose-200/70">{error}</p>
        <Button variant="danger" className="mt-4" onClick={reload}>
          Reintentar
        </Button>
      </div>
    )
  } else if (loading) {
    content = <DashboardSkeleton />
  } else {
    content = (
      <div className="animate-fade-up">
        <Outlet />
      </div>
    )
  }

  // En modo `bare` la página maneja su propio padding, salvo en los estados
  // de carga y error, que sí necesitan márgenes.
  const needsPadding = bare && (loading || Boolean(error))

  return (
    <div className={cn('min-h-dvh', bare ? 'bg-app-bg' : 'bg-brand-50 dark:bg-ink-950')}>
      {!bare && <Header />}

      {/* Pestañas de escritorio */}
      <div
        className={cn(
          'sticky top-16 z-40 border-b border-brand-100 bg-brand-50/85 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/85',
          bare ? 'hidden' : 'hidden sm:block',
        )}
      >
        <nav
          aria-label="Secciones"
          className="mx-auto flex w-full max-w-5xl items-center gap-1 px-6 py-2"
        >
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-white text-brand-700 shadow-sm dark:bg-white/10 dark:text-white'
                    : 'text-ink-700/60 hover:bg-white/60 hover:text-ink-900 dark:text-ink-100/55 dark:hover:bg-white/5 dark:hover:text-white',
                )
              }
            >
              <Icon className="size-4.5" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Contenido. pb-28 deja espacio para la barra inferior en móvil. */}
      <main
        className={cn(
          'mx-auto w-full',
          bare ? 'max-w-none' : 'max-w-5xl px-4 pb-28 pt-5 sm:px-6 sm:pb-12',
          needsPadding && 'px-4 pb-28 pt-5',
        )}
      >
        {content}
      </main>

      {!pushed && <BottomNav />}
    </div>
  )
}

export default Dashboard
