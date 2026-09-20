import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Share } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import ScreenHeader, { HeaderAction } from '../components/ScreenHeader.jsx'
import TicketPassCard from '../components/TicketPassCard.jsx'
import Modal from '../components/ui/Modal.jsx'
import { cn, formatDateTime, formatLongDate, formatMoney } from '../lib/format.js'

/**
 * Detalle de la entrada: el carrusel de pases con su QR.
 *
 * Réplica de la pantalla de la app original (cabecera con el nombre del evento
 * y la fecha corta, y el botón de compartir que abre la transferencia).
 */
export function TicketDetailPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { event, tickets } = useData()

  const [index, setIndex] = useState(0)
  const [infoTicket, setInfoTicket] = useState(null)
  const trackRef = useRef(null)

  const list = useMemo(() => {
    if (!event) return []
    const owned = tickets.filter((t) => (t.eventId ?? event.id) === eventId)
    return owned.length > 0 ? owned : tickets
  }, [tickets, event, eventId])

  if (!event || list.length === 0) return null

  function handleScroll() {
    const el = trackRef.current
    if (!el) return
    const next = Math.round(el.scrollLeft / el.clientWidth)
    if (next !== index) setIndex(next)
  }

  return (
    <div className="min-h-dvh animate-slide-in bg-app-bg font-native">
      <ScreenHeader
        title={event.title}
        subtitle={`${event.shortDateLabel} - ${event.venue}`}
        action={
          <HeaderAction
            label="Transferir entrada"
            onClick={() => navigate(`/tickets/${event.id}/transferir`)}
          >
            <Share className="size-[18px]" aria-hidden="true" />
          </HeaderAction>
        }
      />

      {/* Carrusel: una entrada por pantalla, como en la app original */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {list.map((ticket) => (
          <div key={ticket.id} className="w-full shrink-0 snap-center px-4 pb-2 pt-1">
            <TicketPassCard
              ticket={ticket}
              event={event}
              onMoreInfo={() => setInfoTicket(ticket)}
            />
          </div>
        ))}
      </div>

      {/* Indicador de posición */}
      {list.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pb-4 pt-1">
          {list.map((ticket, i) => (
            <span
              key={ticket.id}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === index ? 'w-4 bg-app-teal' : 'w-1.5 bg-white/25',
              )}
            />
          ))}
          <span className="sr-only">
            Entrada {index + 1} de {list.length}
          </span>
        </div>
      )}

      <p className="px-6 pb-28 text-center text-[11px] leading-relaxed text-app-muted">
        Desliza para ver tus {list.length} entradas. Presenta el código QR en la puerta
        junto a tu documento de identidad.
      </p>

      <Modal
        open={Boolean(infoTicket)}
        onClose={() => setInfoTicket(null)}
        title="Más info"
        description={infoTicket ? `Entrada ${infoTicket.id}` : undefined}
      >
        {infoTicket && (
          <dl className="divide-y divide-brand-100 dark:divide-white/10">
            {[
              ['Titular', infoTicket.holderName],
              ['Evento', event.title],
              ['Recinto', `${event.venue} — ${event.venueAddress}`],
              ['Fecha', formatLongDate(event.dateISO)],
              ['Puertas', `${event.doorsLabel} · Show ${event.showTimeLabel}`],
              ['Puerta de ingreso', infoTicket.gate],
              ['Tarifa', `${infoTicket.fare} — ${formatMoney(infoTicket.price, infoTicket.currency)}`],
              ['Orden de compra', infoTicket.orderId],
              ['Comprado el', formatDateTime(infoTicket.purchaseDate)],
              ['Estado', infoTicket.status],
            ].map(([label, value]) => (
              <div key={label} className="py-2.5">
                <dt className="text-[11px] font-bold uppercase tracking-widest text-ink-700/50 dark:text-ink-100/40">
                  {label}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-ink-900 dark:text-white">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
    </div>
  )
}

export default TicketDetailPage
