import { forwardRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import useRotatingToken from '../hooks/useRotatingToken.js'
import { resolveAsset } from '../lib/env.js'
import { cn } from '../lib/format.js'

/**
 * Tarjeta blanca de la entrada digital, tal como se ve en la app original:
 *
 *   afiche → banda teal con la fecha y la política de compra → QR + sector
 *   → "Más info" → filas de TARIFA / SECCIÓN / FILA / ASIENTO / INICIO
 */
export const TicketPassCard = forwardRef(function TicketPassCard(
  { ticket, event, onMoreInfo, className },
  qrRef,
) {
  const { payload } = useRotatingToken(ticket.id, 30)

  return (
    <article
      className={cn('overflow-hidden rounded-[12px] bg-white', className)}
      aria-label={`Entrada ${ticket.id}`}
    >
      {/* Afiche */}
      {/* La app original encaja el afiche (vertical) en un bloque apaisado de
          proporción 284:266, comprimiéndolo. Se replica igual con object-fill;
          para verlo sin deformar, quita aspect/object-fill y deja `w-full`. */}
      <img
        src={resolveAsset(event.poster)}
        alt={`Afiche de ${event.title}`}
        className="block aspect-[284/266] w-full object-fill"
      />

      {/* Banda con la fecha y la política de compra */}
      <div className="bg-app-teal px-4 pb-2 pt-2 text-center">
        <p className="text-[13px] font-bold tracking-wide text-[#0b0b0b]">
          {event.posterBandDate}
        </p>
        <p className="mt-0.5 text-[7px] leading-[1.35] text-[#0b0b0b]/75">
          {event.purchasePolicyText}
          <br />
          aquí: {event.purchasePolicyUrl}
        </p>
      </div>

      {/* QR + sector */}
      <div className="flex items-center gap-4 px-4 py-4">
        <div className="shrink-0">
          <QRCodeCanvas
            ref={qrRef}
            value={payload}
            size={124}
            level="M"
            marginSize={0}
            bgColor="#ffffff"
            fgColor="#000000"
            title={`Código de acceso de la entrada ${ticket.id}`}
          />
        </div>

        <div className="min-w-0 flex-1 text-center">
          <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-[#9b9b9b]">
            Sector
          </p>
          <p className="mt-0.5 text-[15px] font-normal leading-tight text-[#111]">
            {ticket.section}
          </p>

          <button
            type="button"
            onClick={onMoreInfo}
            className="mt-6 text-[12px] font-medium text-[#2aa7ad] transition-opacity active:opacity-60"
          >
            Más info
          </button>
        </div>
      </div>

      {/* Filas de datos */}
      <div className="border-t border-[#e8e8e8]">
        <Row label="Tarifa" value={`${ticket.fare} - S/ ${ticket.price}`} />
      </div>
      <div className="grid grid-cols-2 border-t border-[#e8e8e8]">
        <Row label="Sección" value={ticket.section} />
        <Row label="Fila" value={ticket.row} className="border-l border-[#e8e8e8]" />
      </div>
      <div className="grid grid-cols-2 border-t border-[#e8e8e8]">
        <Row label="Asiento" value={ticket.seat} />
        <Row label="Inicio" value={ticket.startTimeLabel} className="border-l border-[#e8e8e8]" />
      </div>
    </article>
  )
})

function Row({ label, value, className }) {
  return (
    <div className={cn('px-4 py-2.5', className)}>
      <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-[#9b9b9b]">
        {label}
      </p>
      <p className="mt-0.5 truncate text-[14px] leading-tight text-[#111]">{value}</p>
    </div>
  )
}

export default TicketPassCard
