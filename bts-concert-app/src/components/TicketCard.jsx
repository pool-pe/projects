import { useRef, useState } from 'react'
import {
  BadgeCheck,
  CalendarDays,
  Download,
  DoorOpen,
  Eye,
  MapPin,
  Sofa,
  Wallet,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { cn, formatLongDate, formatMoney, formatTime } from '../lib/format.js'
import { downloadTicketImage, downloadWalletPass } from '../lib/ticketImage.js'
import { isStaticPreview } from '../lib/env.js'
import Badge from './ui/Badge.jsx'
import Button from './ui/Button.jsx'
import QrTicket from './QrTicket.jsx'
import TicketDetailModal from './TicketDetailModal.jsx'

/**
 * Tarjeta de la entrada confirmada: QR dinámico, datos de acceso y acciones
 * (descargar PNG, guardar en Wallet, ver detalle).
 */
export function TicketCard({ ticket, event, compact = false }) {
  const { user } = useAuth()
  const toast = useToast()
  const qrRef = useRef(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)

  if (!ticket || !event) return null

  async function handleDownload() {
    if (isStaticPreview) {
      toast.info('Descarga no disponible en la vista previa', {
        description: 'El visor bloquea las descargas. Corre la app en local para guardar el PNG.',
      })
      return
    }
    setDownloading(true)
    try {
      downloadTicketImage({ ticket, event, qrCanvas: qrRef.current, user })
      toast.success('Entrada descargada', {
        description: `Se guardó entrada-${ticket.id}.png en tu dispositivo.`,
      })
    } catch (error) {
      toast.error('No se pudo descargar', { description: error.message })
    } finally {
      setDownloading(false)
    }
  }

  function handleWallet() {
    if (isStaticPreview) {
      toast.info('Wallet no disponible en la vista previa', {
        description: 'El visor bloquea las descargas. Corre la app en local para generar el pase.',
      })
      return
    }
    try {
      downloadWalletPass({ ticket, event })
      toast.success('Pase generado (simulado)', {
        description: 'En producción se abriría Apple/Google Wallet.',
      })
    } catch (error) {
      toast.error('No se pudo generar el pase', { description: error.message })
    }
  }

  return (
    <>
      <article
        className={cn(
          'relative overflow-hidden rounded-card border border-brand-100 bg-white shadow-lg shadow-brand-900/5',
          'dark:border-white/10 dark:bg-ink-900 dark:shadow-black/40',
        )}
        aria-label={`Entrada ${ticket.id}`}
      >
        {/* Cabecera con degradado */}
        <div className="relative overflow-hidden bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 px-5 py-4 text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.22),transparent_50%)]"
          />
          <div className="relative flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
                Mi entrada
              </p>
              <h3 className="truncate font-display text-lg font-extrabold">{event.title}</h3>
            </div>
            <Badge tone="glass" icon={BadgeCheck} className="shrink-0">
              {ticket.status}
            </Badge>
          </div>
        </div>

        {/* Cuerpo */}
        <div className="px-5 pb-5 pt-6">
          <div className={cn('flex flex-col items-center gap-6', !compact && 'sm:flex-row sm:items-start')}>
            {/* QR */}
            <div className="shrink-0">
              <QrTicket ref={qrRef} ticket={ticket} size={compact ? 156 : 190} />
            </div>

            {/* Datos */}
            <div className="w-full min-w-0 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <DataItem icon={MapPin} label="Zona" value={ticket.zone} highlight />
                <DataItem icon={DoorOpen} label="Puerta" value={ticket.gate} highlight />
                <DataItem icon={Sofa} label="Sector" value={ticket.section} />
                <DataItem icon={BadgeCheck} label="Asiento" value={ticket.seat} />
              </div>

              <div className="mt-4 space-y-2 rounded-2xl bg-brand-50 p-3.5 dark:bg-white/5">
                <Row icon={CalendarDays} label={formatLongDate(event.dateISO)} />
                <Row
                  icon={DoorOpen}
                  label={`Puertas ${formatTime(event.doorsOpenISO)} · Show ${formatTime(event.dateISO)}`}
                />
                <Row icon={MapPin} label={`${event.venue} — ${event.city}`} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                <span className="font-mono text-xs text-ink-700/60 dark:text-ink-100/50">
                  {ticket.id}
                </span>
                <span className="font-display font-bold text-ink-900 dark:text-white">
                  {formatMoney(ticket.price, ticket.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Separador perforado */}
          <div className="relative my-5 flex items-center" aria-hidden="true">
            <span className="absolute -left-8 size-6 rounded-full bg-brand-50 dark:bg-ink-950" />
            <span className="h-px w-full border-t-2 border-dashed border-brand-200 dark:border-white/15" />
            <span className="absolute -right-8 size-6 rounded-full bg-brand-50 dark:bg-ink-950" />
          </div>

          {/* Acciones */}
          <div className="grid gap-2.5 sm:grid-cols-3">
            <Button variant="primary" leftIcon={Wallet} onClick={handleWallet} fullWidth>
              Guardar en Wallet
            </Button>
            <Button
              variant="secondary"
              leftIcon={Download}
              onClick={handleDownload}
              loading={downloading}
              fullWidth
            >
              Descargar
            </Button>
            <Button
              variant="outline"
              leftIcon={Eye}
              onClick={() => setDetailOpen(true)}
              fullWidth
            >
              Ver detalle
            </Button>
          </div>
        </div>
      </article>

      <TicketDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        ticket={ticket}
        event={event}
      />
    </>
  )
}

function DataItem({ icon: Icon, label, value, highlight = false }) {
  return (
    <div
      className={cn(
        'rounded-2xl border px-3 py-2.5',
        highlight
          ? 'border-brand-200 bg-brand-50 dark:border-brand-400/25 dark:bg-brand-500/10'
          : 'border-brand-100 bg-white dark:border-white/10 dark:bg-white/[0.03]',
      )}
    >
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-700/50 dark:text-ink-100/40">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 truncate font-display text-sm font-bold text-ink-900 dark:text-white">
        {value}
      </p>
    </div>
  )
}

function Row({ icon: Icon, label }) {
  return (
    <p className="flex items-center gap-2 text-xs font-medium text-ink-700/80 dark:text-ink-100/70">
      <Icon className="size-4 shrink-0 text-brand-500" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </p>
  )
}

export default TicketCard
