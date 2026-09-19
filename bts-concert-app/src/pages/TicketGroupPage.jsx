import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, History } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import TicketCard from '../components/TicketCard.jsx'
import PurchaseHistory from '../components/PurchaseHistory.jsx'
import Badge from '../components/ui/Badge.jsx'
import { SectionTitle } from '../components/ui/Card.jsx'
import { formatLongDate, formatTime } from '../lib/format.js'

/**
 * Detalle de una función: todas las entradas compradas con su QR.
 * Se llega tocando una fila de "Mis Entradas".
 */
export function TicketGroupPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { event, tickets, purchases } = useData()

  if (!event) return null

  const owned = tickets.filter((ticket) => (ticket.eventId ?? event.id) === eventId)
  const list = owned.length > 0 ? owned : tickets

  return (
    <div className="min-h-dvh bg-app-bg font-native">
      <header className="safe-top sticky top-0 z-40 border-b border-app-line bg-app-bg">
        <div className="flex h-[52px] items-center gap-2 px-2">
          <button
            type="button"
            onClick={() => navigate('/tickets')}
            aria-label="Volver a Mis Entradas"
            className="grid size-[44px] shrink-0 place-items-center rounded-[14px] text-app-icon transition-colors active:bg-white/10"
          >
            <ChevronLeft className="size-6" aria-hidden="true" />
          </button>
          <h1 className="truncate text-[18px] font-bold text-white">{event.title}</h1>
        </div>
      </header>

      <div className="space-y-6 px-4 pb-28 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{list.length} entradas</Badge>
          <Badge tone="neutral">{event.venue}</Badge>
          <Badge tone="success">
            {formatLongDate(event.dateISO)} · {formatTime(event.dateISO)}
          </Badge>
        </div>

        <div className="space-y-5">
          {list.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} event={event} />
          ))}
        </div>

        <section>
          <SectionTitle icon={History}>Historial de compras</SectionTitle>
          <PurchaseHistory purchases={purchases} />
        </section>

        <p className="text-center text-xs text-app-muted">
          <Link to="/" className="font-semibold text-app-teal">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}

export default TicketGroupPage
