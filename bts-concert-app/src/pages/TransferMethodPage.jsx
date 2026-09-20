import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { CircleCheck, QrCode, UserRoundPlus } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import ScreenHeader from '../components/ScreenHeader.jsx'

/**
 * "Transferir entrada": los tres modos de envío de la app original.
 *   · Contactos Frecuentes
 *   · Quentro ID (escanear)
 *   · Vía E-mail
 */
export function TransferMethodPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { event } = useData()

  const ticketIds = location.state?.ticketIds ?? []
  if (!event) return null

  const OPTIONS = [
    {
      id: 'contactos',
      icon: CircleCheck,
      title: 'Contactos Frecuentes',
      description: 'Usuarios de Quentro que ya recibieron transferencias desde tu cuenta',
      onClick: () =>
        toast.info('No tienes contactos frecuentes', {
          description: 'Aquí aparecerán las personas a las que ya transferiste entradas.',
        }),
    },
    {
      id: 'quentro-id',
      icon: QrCode,
      title: 'Quentro ID',
      description: 'Escanea el Quentro ID de otro usuario',
      onClick: () =>
        toast.info('Escáner no disponible en la demo', {
          description: 'Requiere la cámara del dispositivo.',
        }),
    },
    {
      id: 'email',
      icon: UserRoundPlus,
      title: 'Vía E-mail',
      description: 'Ingresa la dirección de e-mail que el destinatario utilizará en Quentro.',
      onClick: () =>
        navigate(`/tickets/${event.id}/transferir/email`, { state: { ticketIds } }),
    },
  ]

  return (
    <div className="min-h-dvh animate-slide-in bg-app-bg font-native">
      <ScreenHeader title="Transferir entrada" />

      <div className="pt-2">
        {OPTIONS.map(({ id, icon: Icon, title, description, onClick }, i) => (
          <button
            key={id}
            type="button"
            onClick={onClick}
            className="flex w-full items-start gap-4 px-5 py-5 text-left transition-colors active:bg-white/5"
            style={i > 0 ? { borderTop: '1px solid var(--color-app-line)' } : undefined}
          >
            <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-[10px] bg-white/[0.06] text-app-teal">
              <Icon className="size-[19px]" aria-hidden="true" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-medium text-white">{title}</span>
              <span className="mt-1 block text-[12px] leading-[1.45] text-app-muted">
                {description}
              </span>
            </span>
          </button>
        ))}
      </div>

      <p className="px-5 pt-6 text-[11px] leading-relaxed text-app-muted">
        {ticketIds.length > 0
          ? `Vas a transferir ${ticketIds.length} ${ticketIds.length === 1 ? 'entrada' : 'entradas'}.`
          : 'Selecciona primero las entradas que quieres transferir.'}
      </p>
    </div>
  )
}

export default TransferMethodPage
