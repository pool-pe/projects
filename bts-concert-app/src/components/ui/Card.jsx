import { cn } from '../../lib/format.js'

/** Contenedor base con estilo de tarjeta (claro/oscuro). */
export function Card({ className, children, as: Component = 'div', ...props }) {
  return (
    <Component
      className={cn(
        'rounded-card border border-brand-100 bg-white shadow-sm shadow-brand-900/5',
        'dark:border-white/10 dark:bg-ink-900 dark:shadow-black/40',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

/** Cabecera estándar: icono + título + subtítulo + acción opcional. */
export function CardHeader({ icon: Icon, title, subtitle, action, className }) {
  return (
    <div className={cn('flex items-start justify-between gap-3', className)}>
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        )}
        <div>
          <h2 className="font-display text-base font-bold text-ink-900 dark:text-ink-50 sm:text-lg">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-ink-700/70 dark:text-ink-100/60 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action}
    </div>
  )
}

/** Título de sección usado entre bloques del dashboard. */
export function SectionTitle({ icon: Icon, children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 px-1">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900 dark:text-ink-50">
        {Icon && <Icon className="size-5 text-brand-500" aria-hidden="true" />}
        {children}
      </h2>
      {action}
    </div>
  )
}

export default Card
