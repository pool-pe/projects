import { CalendarDays, Clock, DoorOpen, MapPin, Share2, Users } from 'lucide-react'
import { useToast } from '../context/ToastContext.jsx'
import { cn, formatLongDate, splitDateParts } from '../lib/format.js'
import Badge from './ui/Badge.jsx'
import Countdown from './Countdown.jsx'

/**
 * Banner del evento destacado: degradado de marca, datos clave y countdown.
 */
export function EventBanner({ event }) {
  const toast = useToast()
  if (!event) return null

  const dateParts = splitDateParts(event.dateISO)

  async function handleShare() {
    const shareData = {
      title: `${event.tour} — ${event.city}`,
      text: `¡Nos vemos en el ${event.venue}! ${formatLongDate(event.dateISO)} · ${event.showTimeLabel}`,
      url: window.location.href,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      toast.success('Enlace copiado', { description: 'Compártelo con tu grupo ARMY.' })
    } catch {
      toast.info('No se pudo compartir', { description: 'Tu navegador bloqueó la acción.' })
    }
  }

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-card p-5 text-white shadow-xl shadow-brand-900/25 sm:p-7',
        'bg-gradient-to-br',
        event.gradient ?? 'from-brand-600 via-brand-500 to-accent-500',
      )}
      aria-labelledby="event-title"
    >
      {/* Textura decorativa */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 size-48 rounded-full bg-accent-300/25 blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
      </div>

      <div className="relative">
        {/* Fila superior */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="glass" dot>
              En vivo pronto
            </Badge>
            {event.status === 'SOLD_OUT' && <Badge tone="glass">Sold out</Badge>}
          </div>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Compartir evento"
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/25 bg-white/15 backdrop-blur-md transition hover:bg-white/25 active:scale-95"
          >
            <Share2 className="size-4.5" aria-hidden="true" />
          </button>
        </div>

        {/* Título + bloque calendario */}
        <div className="mt-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              {event.heroTagline}
            </p>
            <h1
              id="event-title"
              className="mt-2 font-display text-[26px] font-extrabold leading-tight tracking-tight sm:text-4xl"
            >
              {event.title}
            </h1>
            <p className="mt-1 font-display text-lg font-semibold text-white/90 sm:text-2xl">
              {event.subtitle}
            </p>
          </div>

          <div className="hidden shrink-0 flex-col items-center rounded-2xl border border-white/25 bg-white/15 px-4 py-3 text-center backdrop-blur-md sm:flex">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/75">
              {dateParts.month}
            </span>
            <span className="font-display text-4xl font-extrabold leading-none">
              {dateParts.day}
            </span>
            <span className="text-[11px] font-semibold text-white/75">{dateParts.year}</span>
          </div>
        </div>

        {/* Datos del evento */}
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoPill icon={CalendarDays} label="Fecha" value={`${dateParts.weekday} ${dateParts.day}`} />
          <InfoPill icon={MapPin} label="Lugar" value={event.venue} />
          <InfoPill icon={Clock} label="Show" value={event.showTimeLabel} />
          <InfoPill icon={DoorOpen} label="Puertas" value={event.doorsLabel} />
        </dl>

        {/* Countdown */}
        <div className="mt-6">
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/75">
            <Users className="size-3.5" aria-hidden="true" />
            Faltan para el show
          </p>
          <Countdown targetIso={event.dateISO} variant="hero" />
        </div>

        <p className="mt-4 text-xs text-white/70">
          {event.venueAddress} · {event.city} · Aforo {event.capacity.toLocaleString('es-PE')}
        </p>
      </div>
    </section>
  )
}

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur-md">
      <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/65">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 text-[13px] font-bold leading-tight sm:text-sm">{value}</dd>
    </div>
  )
}

export default EventBanner
