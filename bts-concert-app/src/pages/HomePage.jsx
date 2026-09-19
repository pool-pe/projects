import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Compass,
  Heart,
  MapPinned,
  Music4,
  Ticket as TicketIcon,
  Users,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { SectionTitle } from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import EventBanner from '../components/EventBanner.jsx'
import TicketCard from '../components/TicketCard.jsx'
import ConcertGuide from '../components/ConcertGuide.jsx'
import { formatShortDate } from '../lib/format.js'

/** Vista principal del dashboard. */
export function HomePage() {
  const { user } = useAuth()
  const { event, primaryTicket, tickets, guide } = useData()

  return (
    <div className="space-y-8">
      {/* 1. Evento destacado */}
      <EventBanner event={event} />

      {/* 2. Accesos rápidos */}
      <section className="grid grid-cols-3 gap-3">
        <QuickStat
          icon={TicketIcon}
          value={tickets.length}
          label={tickets.length === 1 ? 'Entrada' : 'Entradas'}
        />
        <QuickStat icon={Users} value={event?.lineup?.length ?? 7} label="Integrantes" />
        <QuickStat
          icon={MapPinned}
          value={event ? formatShortDate(event.dateISO).split(' ')[0] : '—'}
          label={event ? formatShortDate(event.dateISO).split(' ')[1] : ''}
        />
      </section>

      {/* 3. Entrada confirmada */}
      <section>
        <SectionTitle
          icon={TicketIcon}
          action={
            tickets.length > 1 && (
              <Link
                to="/tickets"
                className="flex items-center gap-1 text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-300"
              >
                Ver todas
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )
          }
        >
          Mi entrada confirmada
        </SectionTitle>

        {primaryTicket ? (
          <TicketCard ticket={primaryTicket} event={event} />
        ) : (
          <EmptyTickets />
        )}
      </section>

      {/* 4. Lineup */}
      {event?.lineup?.length > 0 && (
        <section>
          <SectionTitle icon={Music4}>En el escenario</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {event.lineup.map((member) => (
              <span
                key={member}
                className="flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3.5 py-2 text-sm font-semibold text-ink-900 transition hover:border-brand-400 hover:shadow-sm dark:border-white/10 dark:bg-ink-900 dark:text-white dark:hover:border-brand-400/40"
              >
                <Heart className="size-3.5 text-accent-500" aria-hidden="true" />
                {member}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 5. Guía del día del concierto */}
      <section>
        <SectionTitle icon={Compass}>Guía para el día del concierto</SectionTitle>
        <ConcertGuide guide={guide} />
      </section>

      {/* 6. Cierre */}
      <section className="overflow-hidden rounded-card border border-brand-200 bg-gradient-to-br from-brand-100 to-accent-400/20 p-5 text-center dark:border-brand-400/20 dark:from-brand-500/10 dark:to-accent-500/10">
        <p className="font-display text-lg font-extrabold text-ink-900 dark:text-white">
          ¡Nos vemos en el Estadio Nacional, {user?.name ?? 'ARMY'}! 💜
        </p>
        <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-100/60">
          Revisa tu puerta de ingreso y llega con anticipación.
        </p>
        <Button as={Link} to="/tickets" variant="primary" className="mt-4" rightIcon={ArrowRight}>
          Ir a mis tickets
        </Button>
      </section>
    </div>
  )
}

function QuickStat({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-brand-100 bg-white px-2 py-4 text-center dark:border-white/10 dark:bg-ink-900">
      <Icon className="size-5 text-brand-500" aria-hidden="true" />
      <span className="mt-1.5 font-display text-xl font-extrabold leading-none text-ink-900 dark:text-white">
        {value}
      </span>
      <span className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-ink-700/50 dark:text-ink-100/40">
        {label}
      </span>
    </div>
  )
}

function EmptyTickets() {
  return (
    <div className="rounded-card border border-dashed border-brand-200 bg-white/60 px-6 py-12 text-center dark:border-white/10 dark:bg-ink-900/60">
      <TicketIcon className="mx-auto size-10 text-brand-400" aria-hidden="true" />
      <p className="mt-3 font-display text-lg font-bold text-ink-900 dark:text-white">
        Aún no tienes entradas
      </p>
      <p className="mt-1 text-sm text-ink-700/65 dark:text-ink-100/55">
        Cuando compres una, aparecerá aquí con su código QR de acceso.
      </p>
    </div>
  )
}

export default HomePage
