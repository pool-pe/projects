import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/format.js'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-brand-600 to-accent-500 text-white shadow-lg shadow-brand-600/25 hover:brightness-110 active:brightness-95',
  secondary:
    'bg-brand-100 text-brand-800 hover:bg-brand-200 dark:bg-brand-500/15 dark:text-brand-100 dark:hover:bg-brand-500/25',
  outline:
    'border border-brand-200 bg-white/70 text-ink-900 hover:border-brand-400 hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-ink-50 dark:hover:border-brand-400/60 dark:hover:bg-white/10',
  ghost:
    'text-ink-700 hover:bg-brand-100/70 dark:text-ink-100 dark:hover:bg-white/10',
  danger:
    'bg-rose-500 text-white shadow-lg shadow-rose-500/25 hover:bg-rose-600 active:bg-rose-700',
}

const SIZES = {
  sm: 'h-9 gap-1.5 px-3 text-sm',
  md: 'h-11 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2 px-5 text-base',
  icon: 'size-10 justify-center',
}

/**
 * Botón reutilizable.
 * - `as`: permite renderizar un <a> o un <Link> manteniendo los estilos.
 * - `loading`: bloquea el click y muestra un spinner.
 */
export function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <Component
      className={cn(
        'inline-flex select-none items-center rounded-xl font-semibold transition-all duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
        'disabled:cursor-not-allowed disabled:opacity-55 disabled:shadow-none',
        'active:scale-[0.98]',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full justify-center',
        className,
      )}
      disabled={Component === 'button' ? isDisabled : undefined}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        LeftIcon && <LeftIcon className="size-4 shrink-0" aria-hidden="true" />
      )}
      {children}
      {!loading && RightIcon && <RightIcon className="size-4 shrink-0" aria-hidden="true" />}
    </Component>
  )
}

export default Button
