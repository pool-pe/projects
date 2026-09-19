import { cn } from '../../lib/format.js'

const TONES = {
  brand:
    'bg-brand-100 text-brand-700 ring-brand-200 dark:bg-brand-500/15 dark:text-brand-200 dark:ring-brand-400/25',
  success:
    'bg-emerald-100 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/25',
  warning:
    'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/25',
  danger:
    'bg-rose-100 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/25',
  neutral:
    'bg-ink-100 text-ink-700 ring-ink-100 dark:bg-white/10 dark:text-ink-100 dark:ring-white/10',
  glass: 'bg-white/20 text-white ring-white/30 backdrop-blur-sm',
}

export function Badge({ tone = 'brand', icon: Icon, children, className, dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {dot && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-70" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {children}
    </span>
  )
}

export default Badge
