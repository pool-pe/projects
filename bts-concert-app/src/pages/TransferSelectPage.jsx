import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import { resolveAsset } from '../lib/env.js'
import { cn } from '../lib/format.js'

/**
 * "Seleccionar entradas": primer paso de la transferencia.
 *
 * La entrada elegida se pinta en blanco con un check teal; las no elegidas
 * quedan en gris oscuro. Abajo, el botón blanco "Transferir entrada".
 */
export function TransferSelectPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { event, tickets } = useData()

  const list = useMemo(() => {
    if (!event) return []
    const owned = tickets.filter((t) => (t.eventId ?? event.id) === eventId)
    return owned.length > 0 ? owned : tickets
  }, [tickets, event, eventId])

  // Por defecto van todas seleccionadas: lo normal es transferir la compra entera.
  const [selected, setSelected] = useState(() => new Set(list.map((t) => t.id)))

  if (!event || list.length === 0) return null

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex min-h-dvh animate-slide-in flex-col bg-app-bg font-native">
      <ScreenHeader title="Seleccionar entradas" />

      <div className="flex-1 space-y-3 px-4 pb-40 pt-2">
        {list.map((ticket) => {
          const isSelected = selected.has(ticket.id)

          return (
            <button
              key={ticket.id}
              type="button"
              onClick={() => toggle(ticket.id)}
              aria-pressed={isSelected}
              className="flex w-full items-stretch gap-2 text-left"
            >
              {/* Miniatura del afiche */}
              <span className="relative shrink-0 overflow-hidden rounded-[8px]">
                <img
                  src={resolveAsset(event.poster)}
                  alt=""
                  className="h-full w-[74px] object-fill"
                />
                <span className="absolute inset-x-0 bottom-0 bg-app-teal py-[3px] text-center text-[5px] font-bold text-[#0b0b0b]">
                  {event.posterBandDate}
                </span>
              </span>

              {/* Cuerpo de la tarjeta */}
              <span
                className={cn(
                  'relative min-w-0 flex-1 rounded-[10px] px-4 py-3 transition-colors duration-200',
                  isSelected ? 'bg-[#f4f2ef] text-[#111]' : 'bg-[#2c3235] text-white',
                )}
              >
                {isSelected && (
                  <span className="absolute -left-[13px] top-1/2 grid size-[26px] -translate-y-1/2 place-items-center rounded-full bg-app-teal ring-[3px] ring-app-bg">
                    <Check className="size-4 text-white" strokeWidth={3} aria-hidden="true" />
                  </span>
                )}

                <span className="block truncate text-[15px] font-semibold">
                  {ticket.section}
                </span>

                <span className="mt-2 grid grid-cols-3 gap-2">
                  <Field label="Sección" value={ticket.section} selected={isSelected} />
                  <Field label="Fila" value={ticket.row} selected={isSelected} />
                  <Field label="Asiento" value={ticket.seat} selected={isSelected} />
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/* Botón inferior fijo */}
      <div className="safe-bottom fixed inset-x-0 bottom-0 bg-gradient-to-t from-app-bg via-app-bg to-transparent px-4 pb-4 pt-8">
        <button
          type="button"
          disabled={selected.size === 0}
          onClick={() =>
            navigate(`/tickets/${event.id}/transferir/metodo`, {
              state: { ticketIds: [...selected] },
            })
          }
          className={cn(
            'h-[52px] w-full rounded-[26px] text-[15px] font-semibold transition-all duration-200',
            selected.size === 0
              ? 'cursor-not-allowed bg-white/25 text-white/50'
              : 'bg-white text-[#111] active:scale-[0.99]',
          )}
        >
          Transferir entrada
        </button>
      </div>
    </div>
  )
}

function Field({ label, value, selected }) {
  return (
    <span className="block min-w-0">
      <span
        className={cn(
          'block text-[7px] font-medium uppercase tracking-[0.1em]',
          selected ? 'text-[#9b9b9b]' : 'text-white/45',
        )}
      >
        {label}
      </span>
      <span className="mt-0.5 block truncate text-[11px]">{value}</span>
    </span>
  )
}

export default TransferSelectPage
