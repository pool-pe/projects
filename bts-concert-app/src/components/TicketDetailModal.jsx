import {
  BadgeCheck,
  CalendarDays,
  CreditCard,
  DoorOpen,
  Hash,
  MapPin,
  Receipt,
  Sofa,
  Ticket as TicketIcon,
  User,
} from 'lucide-react'
import { formatDateTime, formatLongDate, formatMoney, formatTime } from '../lib/format.js'
import Badge from './ui/Badge.jsx'
import Button from './ui/Button.jsx'
import Modal from './ui/Modal.jsx'

/** Detalle completo del acceso: titular, puerta, orden y beneficios. */
export function TicketDetailModal({ open, onClose, ticket, event }) {
  if (!ticket || !event) return null

  const rows = [
    { icon: User, label: 'Titular', value: ticket.holderName },
    { icon: Hash, label: 'Código de entrada', value: ticket.id, mono: true },
    { icon: MapPin, label: 'Zona', value: ticket.zone },
    { icon: DoorOpen, label: 'Puerta de ingreso', value: ticket.gate },
    { icon: Sofa, label: 'Sector', value: ticket.section },
    { icon: TicketIcon, label: 'Asiento', value: `${ticket.row} · ${ticket.seat}` },
    { icon: CalendarDays, label: 'Fecha', value: formatLongDate(event.dateISO) },
    {
      icon: DoorOpen,
      label: 'Horarios',
      value: `Puertas ${formatTime(event.doorsOpenISO)} · Show ${formatTime(event.dateISO)}`,
    },
    { icon: MapPin, label: 'Recinto', value: `${event.venue} — ${event.venueAddress}` },
    { icon: Receipt, label: 'Orden de compra', value: ticket.orderId, mono: true },
    { icon: CreditCard, label: 'Método de pago', value: ticket.paymentMethod },
    { icon: CalendarDays, label: 'Comprado el', value: formatDateTime(ticket.purchaseDate) },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Detalle de acceso"
      description={`${event.title} · ${event.city}`}
      size="md"
      footer={
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-ink-700/50 dark:text-ink-100/40">
              Total pagado
            </p>
            <p className="font-display text-lg font-extrabold text-ink-900 dark:text-white">
              {formatMoney(ticket.price, ticket.currency)}
            </p>
          </div>
          <Button variant="primary" onClick={onClose}>
            Entendido
          </Button>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone="success" icon={BadgeCheck}>
          Ticket {ticket.status}
        </Badge>
        {ticket.transferable && <Badge tone="brand">Transferible</Badge>}
        <Badge tone="neutral">{event.venue}</Badge>
      </div>

      <dl className="divide-y divide-brand-100 dark:divide-white/10">
        {rows.map(({ icon: Icon, label, value, mono }) => (
          <div key={label} className="flex items-start gap-3 py-3">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <dt className="text-[11px] font-bold uppercase tracking-widest text-ink-700/50 dark:text-ink-100/40">
                {label}
              </dt>
              <dd
                className={
                  mono
                    ? 'mt-0.5 break-all font-mono text-sm text-ink-900 dark:text-white'
                    : 'mt-0.5 text-sm font-semibold text-ink-900 dark:text-white'
                }
              >
                {value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {ticket.includes?.length > 0 && (
        <section className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4 dark:border-white/10 dark:bg-white/5">
          <h3 className="font-display text-sm font-bold text-ink-900 dark:text-white">
            Tu entrada incluye
          </h3>
          <ul className="mt-2.5 space-y-2">
            {ticket.includes.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-sm text-ink-700/85 dark:text-ink-100/75"
              >
                <BadgeCheck
                  className="mt-0.5 size-4 shrink-0 text-emerald-500"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-4 rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
        Llega con al menos 2 horas de anticipación. El código QR se renueva cada 30 segundos por
        seguridad, así que muéstralo directamente desde la app (una captura de pantalla no será
        válida en el control de acceso).
      </p>
    </Modal>
  )
}

export default TicketDetailModal
