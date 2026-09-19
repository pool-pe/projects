import { Bell, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { cn } from '../lib/format.js'

/**
 * Cabecera de la pantalla "Mis Entradas".
 *
 * Réplica medida pixel a pixel sobre la captura de la app original
 * (1080 px de ancho, densidad ~2.77 => 390 px CSS):
 *   - título 24 px bold
 *   - botones de 52×52 con radio 16 e icono de 18 px (#98a1a3)
 *   - control segmentado de 60 px de alto, radio 14, pista #081410
 *   - píldora activa de 46 px de alto y radio 8, blanca con texto 17 px
 *   - hairline #1b2327 justo debajo
 */
export function MyTicketsHeader({ tab, onTabChange }) {
  const navigate = useNavigate()
  const { unreadCount } = useData()

  const TABS = [
    { id: 'proximos', label: 'Próximos' },
    { id: 'pasados', label: 'Pasados' },
  ]

  return (
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
              onClick={() => navigate('/')}
            >
              <Bell className="size-[18px]" aria-hidden="true" />
            </IconButton>

            <IconButton label="Mi perfil" onClick={() => navigate('/perfil')}>
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
