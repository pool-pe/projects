import { cn, capitalize } from '../lib/format.js'

/**
 * Fila de la lista "Mis Entradas": afiche a la izquierda y datos a la derecha.
 *
 * Medidas tomadas de la captura original (390 px CSS de ancho):
 *   tarjeta 99 px de alto, radio 10, fondo #182022
 *   afiche 105 px de ancho a sangre (object-cover)
 *   texto a 21 px del afiche
 *   línea meta 11 px  · título 17 px bold · recinto 13 px
 */
export function TicketListItem({ group, onClick }) {
  const { event, count, dateISO } = group

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[99px] w-full items-stretch overflow-hidden rounded-[10px] bg-app-surface text-left',
        'transition-colors duration-150 active:bg-white/[0.06]',
      )}
    >
      <img
        src={event.poster ?? '/posters/bts-arirang.svg'}
        alt={`Afiche de ${event.title}`}
        width={105}
        height={99}
        className="h-full w-[105px] shrink-0 object-cover"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-center pl-[21px] pr-[26px] pt-[3px]">
        <p className="flex items-baseline gap-[11px] whitespace-nowrap text-[10px] leading-[12px]">
          <span className="text-[10px] font-medium text-app-teal">
            {count} {count === 1 ? 'entrada' : 'entradas'}
          </span>
          <span className="text-[10px] text-app-muted">{formatWhen(dateISO)}</span>
        </p>

        <p className="mt-[6px] truncate text-[18px] font-bold leading-[22px] text-white">
          {event.title}
        </p>

        <p className="mt-[4px] truncate text-[13px] leading-[13px] text-app-soft">{event.venue}</p>
      </div>
    </button>
  )
}

/** "miércoles 7 20:00hs" — mismo formato que la app original. */
function formatWhen(iso) {
  const date = new Date(iso)
  const weekday = date.toLocaleDateString('es-PE', {
    weekday: 'long',
    timeZone: 'America/Lima',
  })
  const day = date.toLocaleDateString('es-PE', { day: 'numeric', timeZone: 'America/Lima' })
  const time = date.toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Lima',
  })
  return `${weekday} ${day} ${time}hs`
}

/** "Octubre 2026" para los encabezados de mes. */
export function formatMonthLabel(iso) {
  const date = new Date(iso)
  return {
    month: capitalize(
      date.toLocaleDateString('es-PE', { month: 'long', timeZone: 'America/Lima' }),
    ),
    year: date.toLocaleDateString('es-PE', { year: 'numeric', timeZone: 'America/Lima' }),
  }
}

/**
 * Agrupa las entradas por evento + función, que es lo que muestra la lista
 * ("4 entradas" en una sola fila, no 4 filas).
 */
export function groupTickets(tickets, event) {
  const groups = new Map()

  tickets.forEach((ticket) => {
    const dateISO = ticket.dateISO ?? event?.dateISO
    const key = `${ticket.eventId ?? event?.id}__${dateISO}`
    if (!groups.has(key)) {
      groups.set(key, { key, event, dateISO, count: 0, tickets: [] })
    }
    const group = groups.get(key)
    group.count += 1
    group.tickets.push(ticket)
  })

  return [...groups.values()].sort((a, b) => new Date(a.dateISO) - new Date(b.dateISO))
}

export default TicketListItem
