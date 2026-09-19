import { NavLink } from 'react-router-dom'
import { House, Ticket, UserRound } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { cn } from '../lib/format.js'

const ITEMS = [
  { to: '/', label: 'Inicio', icon: House, end: true },
  { to: '/tickets', label: 'Mis Tickets', icon: Ticket, badge: true },
  { to: '/perfil', label: 'Perfil', icon: UserRound },
]

/**
 * Barra de navegación inferior, pensada para el pulgar en móvil.
 * En pantallas ≥ sm se oculta (allí se navega desde el header).
 */
export function BottomNav() {
  const { tickets } = useData()

  return (
    <nav
      aria-label="Navegación principal"
      className="glass safe-bottom fixed inset-x-0 bottom-0 z-50 border-x-0 border-b-0 sm:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'group relative flex flex-col items-center gap-1 rounded-2xl px-2 py-2 transition-all duration-200',
                  isActive
                    ? 'text-brand-600 dark:text-brand-300'
                    : 'text-ink-700/55 hover:text-ink-900 dark:text-ink-100/50 dark:hover:text-white',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {/* Indicador superior de pestaña activa */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -top-1.5 h-1 rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300',
                      isActive ? 'w-8 opacity-100' : 'w-0 opacity-0',
                    )}
                  />

                  <span className="relative">
                    <Icon
                      className={cn(
                        'size-6 transition-transform duration-200',
                        isActive && 'scale-110',
                      )}
                      strokeWidth={isActive ? 2.4 : 2}
                      aria-hidden="true"
                    />
                    {badge && tickets.length > 0 && (
                      <span className="absolute -right-1.5 -top-1 grid min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[9px] font-bold text-white">
                        {tickets.length}
                      </span>
                    )}
                  </span>

                  <span className="text-[11px] font-semibold leading-none">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default BottomNav
