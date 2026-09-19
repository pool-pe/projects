import { PartyPopper } from 'lucide-react'
import useCountdown from '../hooks/useCountdown.js'
import { cn } from '../lib/format.js'

const UNITS = [
  { key: 'days', label: 'Días' },
  { key: 'hours', label: 'Horas' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Seg' },
]

/**
 * Cuenta regresiva hasta el show.
 * `variant="hero"` se usa dentro del banner (sobre degradado),
 * `variant="plain"` en fondos claros/oscuros normales.
 */
export function Countdown({ targetIso, variant = 'hero', className }) {
  const time = useCountdown(targetIso)

  if (time.isPast) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold',
          variant === 'hero'
            ? 'bg-white/20 text-white backdrop-blur-sm'
            : 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200',
          className,
        )}
      >
        <PartyPopper className="size-5" aria-hidden="true" />
        ¡El show ya comenzó! Disfruta el concierto 💜
      </div>
    )
  }

  return (
    <div
      className={cn('grid grid-cols-4 gap-2 sm:gap-3', className)}
      role="timer"
      aria-live="off"
      aria-label={`Faltan ${time.days} días, ${time.hours} horas, ${time.minutes} minutos y ${time.seconds} segundos`}
    >
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className={cn(
            'flex flex-col items-center justify-center rounded-2xl py-2.5 tabular-nums transition-colors sm:py-3',
            variant === 'hero'
              ? 'border border-white/25 bg-white/15 text-white backdrop-blur-md'
              : 'border border-brand-100 bg-white text-ink-900 dark:border-white/10 dark:bg-ink-900 dark:text-white',
          )}
        >
          <span className="font-display text-xl font-extrabold leading-none sm:text-3xl">
            {String(time[key]).padStart(2, '0')}
          </span>
          <span
            className={cn(
              'mt-1 text-[10px] font-semibold uppercase tracking-widest sm:text-[11px]',
              variant === 'hero' ? 'text-white/70' : 'text-ink-700/50 dark:text-ink-100/45',
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default Countdown
