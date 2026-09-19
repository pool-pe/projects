import {
  AtSign,
  CalendarCheck,
  CreditCard,
  Crown,
  History,
  IdCard,
  LogOut,
  MapPin,
  Phone,
  Settings2,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Avatar from '../components/ui/Avatar.jsx'
import Badge from '../components/ui/Badge.jsx'
import Button from '../components/ui/Button.jsx'
import { Card, SectionTitle } from '../components/ui/Card.jsx'
import PreferencesPanel from '../components/PreferencesPanel.jsx'
import PurchaseHistory from '../components/PurchaseHistory.jsx'
import { formatShortDate } from '../lib/format.js'

/** Sección de cuenta: datos personales, historial y preferencias. */
export function ProfilePage() {
  const { user, logout } = useAuth()
  const { purchases, tickets } = useData()
  const toast = useToast()

  if (!user) return null

  const personalData = [
    { icon: UserRound, label: 'Nombre completo', value: user.fullName ?? user.name },
    { icon: AtSign, label: 'Correo electrónico', value: user.email },
    { icon: IdCard, label: 'Documento', value: user.document ?? 'No registrado' },
    { icon: Phone, label: 'Teléfono', value: user.phone ?? 'No registrado' },
    { icon: MapPin, label: 'Ciudad', value: user.city ?? 'Lima, Perú' },
    {
      icon: CalendarCheck,
      label: 'Miembro desde',
      value: user.memberSince ? formatShortDate(user.memberSince) : '—',
    },
  ]

  function handleLogout() {
    logout()
    toast.info('Sesión cerrada', { description: 'Vuelve pronto 💜' })
  }

  return (
    <div className="space-y-8">
      {/* Cabecera del perfil */}
      <Card className="relative overflow-hidden p-0">
        <div className="h-24 bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500" />

        <div className="px-5 pb-5">
          <div className="-mt-10 flex items-end gap-4">
            <Avatar name={user.fullName ?? user.name} size="xl" className="ring-4" />
            <div className="min-w-0 flex-1 pb-1">
              <h1 className="truncate font-display text-xl font-extrabold text-ink-900 dark:text-white">
                {user.fullName ?? user.name}
              </h1>
              <p className="truncate text-sm text-ink-700/65 dark:text-ink-100/55">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="brand" icon={Crown}>
              {user.tier ?? 'ARMY Membership'}
            </Badge>
            <Badge tone="success" icon={ShieldCheck}>
              Cuenta verificada
            </Badge>
            {user.provider && <Badge tone="neutral">Vía {user.provider}</Badge>}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat value={tickets.length} label="Entradas" />
            <Stat value={purchases.length} label="Compras" />
            <Stat value={user.preferences?.language ?? 'es-PE'} label="Idioma" />
          </div>
        </div>
      </Card>

      {/* Datos personales */}
      <section>
        <SectionTitle icon={IdCard}>Datos personales</SectionTitle>
        <Card className="divide-y divide-brand-100 p-0 dark:divide-white/10">
          {personalData.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ink-700/50 dark:text-ink-100/40">
                  {label}
                </p>
                <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </Card>

        <p className="mt-2 px-1 text-xs text-ink-700/55 dark:text-ink-100/45">
          Los datos sensibles se muestran enmascarados, igual que en la app oficial.
        </p>
      </section>

      {/* Métodos de pago */}
      <section>
        <SectionTitle icon={CreditCard}>Método de pago</SectionTitle>
        <Card className="flex items-center gap-4 p-4">
          <span className="grid h-11 w-16 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 font-display text-xs font-extrabold text-white">
            VISA
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold text-ink-900 dark:text-white">
              Visa •••• 4821
            </p>
            <p className="text-xs text-ink-700/60 dark:text-ink-100/50">
              Vence 09/29 · Tarjeta principal
            </p>
          </div>
          <Badge tone="success">Activa</Badge>
        </Card>
      </section>

      {/* Historial */}
      <section>
        <SectionTitle icon={History}>Historial de compras</SectionTitle>
        <PurchaseHistory purchases={purchases} />
      </section>

      {/* Preferencias */}
      <section>
        <SectionTitle icon={Settings2}>Preferencias</SectionTitle>
        <PreferencesPanel />
      </section>

      {/* Cerrar sesión */}
      <section className="pb-2">
        <Button variant="danger" fullWidth leftIcon={LogOut} onClick={handleLogout}>
          Cerrar sesión
        </Button>
        <p className="mt-3 text-center text-xs text-ink-700/50 dark:text-ink-100/40">
          ARMY Pass · versión demo 1.0.0
        </p>
      </section>
    </div>
  )
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50 px-2 py-3 text-center dark:border-white/10 dark:bg-white/5">
      <p className="font-display text-lg font-extrabold leading-none text-ink-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-ink-700/50 dark:text-ink-100/40">
        {label}
      </p>
    </div>
  )
}

export default ProfilePage
