import { useState } from 'react'
import {
  Ban,
  BusFront,
  CheckCircle2,
  ChevronDown,
  Clock,
  Sparkles,
} from 'lucide-react'
import { cn } from '../lib/format.js'

/** Mapea el `icon` de los datos a un componente real de lucide-react. */
const ICONS = {
  bus: BusFront,
  clock: Clock,
  check: CheckCircle2,
  ban: Ban,
  sparkles: Sparkles,
}

const ACCENTS = {
  brand: 'bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300',
  accent: 'bg-accent-400/20 text-accent-600 dark:bg-accent-500/15 dark:text-accent-300',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  rose: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
}

/**
 * Acordeón con la guía del día del concierto: cómo llegar, horarios, objetos
 * permitidos/prohibidos y recomendaciones.
 */
export function ConcertGuide({ guide = [] }) {
  const [openId, setOpenId] = useState(guide[0]?.id ?? null)

  if (guide.length === 0) return null

  return (
    <div className="space-y-2.5">
      {guide.map((section) => {
        const Icon = ICONS[section.icon] ?? Sparkles
        const isOpen = openId === section.id

        return (
          <div
            key={section.id}
            className={cn(
              'overflow-hidden rounded-card border transition-all duration-300',
              isOpen
                ? 'border-brand-300 bg-white shadow-md shadow-brand-900/5 dark:border-brand-400/30 dark:bg-ink-900'
                : 'border-brand-100 bg-white/70 dark:border-white/10 dark:bg-ink-900/60',
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : section.id)}
              aria-expanded={isOpen}
              aria-controls={`guide-panel-${section.id}`}
              className="flex w-full items-center gap-3 px-4 py-4 text-left"
            >
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-xl',
                  ACCENTS[section.accent] ?? ACCENTS.brand,
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-display text-[15px] font-bold text-ink-900 dark:text-white">
                  {section.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-ink-700/65 dark:text-ink-100/55">
                  {section.summary}
                </span>
              </span>

              <ChevronDown
                className={cn(
                  'size-5 shrink-0 text-ink-700/40 transition-transform duration-300 dark:text-ink-100/40',
                  isOpen && 'rotate-180 text-brand-500 dark:text-brand-300',
                )}
                aria-hidden="true"
              />
            </button>

            <div
              id={`guide-panel-${section.id}`}
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <ul className="space-y-2.5 px-4 pb-4 pl-[4.25rem]">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="relative text-sm leading-relaxed text-ink-700/85 before:absolute before:-left-4 before:top-2 before:size-1.5 before:rounded-full before:bg-brand-400 dark:text-ink-100/75"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ConcertGuide
