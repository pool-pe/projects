import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'
import { cn } from '../lib/format.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * "Vía E-mail": último paso de la transferencia.
 * Campo de correo y botón CONFIRMAR, deshabilitado hasta que el correo es válido.
 */
export function TransferEmailPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { event } = useData()

  const ticketIds = location.state?.ticketIds ?? []
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)

  const isValid = EMAIL_RE.test(email.trim())
  if (!event) return null

  async function handleConfirm() {
    if (!isValid || sending) return
    setSending(true)
    // La transferencia es simulada: no hay servicio real de envío.
    await new Promise((resolve) => setTimeout(resolve, 900))
    setSending(false)
    toast.success('Transferencia enviada', {
      description: `${ticketIds.length || 1} entrada(s) enviada(s) a ${email.trim()}.`,
    })
    navigate(`/tickets/${event.id}`, { replace: true })
  }

  return (
    <div className="min-h-dvh animate-slide-in bg-app-bg font-native">
      <ScreenHeader title="Vía E-mail" />

      <div className="px-6 pt-6">
        <p className="text-center text-[14px] leading-snug text-white">
          Ingrese la dirección de E-mail del destinatario
        </p>

        <input
          id="transfer-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          placeholder="correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          aria-label="Correo electrónico del destinatario"
          className="mt-7 h-11 w-full border-b border-white/15 bg-transparent text-[14px] text-white outline-none placeholder:text-app-muted/70 focus:border-app-teal"
        />

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!isValid || sending}
          className={cn(
            'mt-9 h-[46px] w-full rounded-[6px] text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200',
            isValid
              ? 'bg-app-teal text-[#08191a] active:brightness-95'
              : 'cursor-not-allowed bg-white/[0.08] text-white/35',
          )}
        >
          {sending ? 'Enviando…' : 'Confirmar'}
        </button>

        <p className="mt-6 text-[11px] leading-relaxed text-app-muted">
          El destinatario recibirá un correo para reclamar la entrada con su cuenta de
          Quentro. En esta demo la transferencia es simulada.
        </p>
      </div>
    </div>
  )
}

export default TransferEmailPage
