import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { cn } from '../lib/format.js'

/**
 * Cabecera de las pantallas apiladas (detalle, transferencia…).
 *
 * Replica la de la app original: flecha de retroceso, título (truncado a una
 * línea), subtítulo opcional debajo y un botón de acción cuadrado a la derecha.
 */
export function ScreenHeader({ title, subtitle, action, onBack, className }) {
  const navigate = useNavigate()

  return (
    <header
      className={cn(
        'safe-top sticky top-0 z-40 bg-app-bg',
        className,
      )}
    >
      <div className="flex items-center gap-1 px-2 py-2">
        <button
          type="button"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          aria-label="Volver"
          className="grid size-10 shrink-0 place-items-center rounded-full text-white transition-colors active:bg-white/10"
        >
          <ChevronLeft className="size-[22px]" strokeWidth={2.2} aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[15px] font-semibold leading-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-[12px] leading-tight text-app-muted">{subtitle}</p>
          )}
        </div>

        {action}
      </div>
    </header>
  )
}

/** Botón cuadrado de acción del header (el de compartir/transferir). */
export function HeaderAction({ children, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-white/10 text-white transition-colors active:bg-white/20"
    >
      {children}
    </button>
  )
}

export default ScreenHeader
