import { useEffect, useState } from 'react'
import {
  ArrowRight,
  AtSign,
  Eye,
  EyeOff,
  Lock,
  Music4,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  User,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { DEMO_USER, FEATURED_EVENT } from '../data/mockDb.js'
import { cn } from '../lib/format.js'
import Button from './ui/Button.jsx'
import ThemeToggle from './ThemeToggle.jsx'

/* Iconos de marca en SVG inline (lucide-react no incluye logos de terceros). */
function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.63h6.2a5.3 5.3 0 0 1-2.3 3.48v2.89h3.72c2.18-2 3.44-4.96 3.44-8.55Z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.11 0 5.72-1.03 7.62-2.79l-3.72-2.89c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.02-6.45-4.75H1.71v2.98A11.5 11.5 0 0 0 12 23.5Z"
      />
      <path
        fill="#FBBC05"
        d="M5.55 14.17a6.9 6.9 0 0 1 0-4.34V6.85H1.71a11.5 11.5 0 0 0 0 10.3l3.84-2.98Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.08c1.69 0 3.21.58 4.4 1.72l3.3-3.3C17.71 1.6 15.1.5 12 .5A11.5 11.5 0 0 0 1.71 6.85l3.84 2.98C6.46 7.1 9 5.08 12 5.08Z"
      />
    </svg>
  )
}

function AppleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true" {...props}>
      <path d="M16.36 12.72c-.02-2.28 1.86-3.37 1.95-3.42-1.06-1.55-2.71-1.77-3.3-1.79-1.4-.14-2.74.83-3.45.83-.71 0-1.81-.81-2.98-.79-1.53.02-2.95.89-3.74 2.26-1.6 2.77-.41 6.87 1.14 9.12.76 1.1 1.66 2.34 2.85 2.29 1.14-.05 1.57-.74 2.95-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.41-3.67ZM14.2 5.6c.63-.76 1.05-1.82.93-2.88-.9.04-1.99.6-2.64 1.36-.58.67-1.09 1.75-.95 2.78 1 .08 2.03-.51 2.66-1.26Z" />
    </svg>
  )
}

function KakaoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true" {...props}>
      <path d="M12 3C6.92 3 2.8 6.2 2.8 10.15c0 2.54 1.7 4.77 4.26 6.03-.14.5-.9 3.1-.93 3.31 0 0-.02.16.08.22.1.06.23.01.23.01.29-.04 3.37-2.2 3.9-2.58.54.08 1.1.12 1.66.12 5.08 0 9.2-3.2 9.2-7.11C21.2 6.2 17.08 3 12 3Z" />
    </svg>
  )
}

const SOCIALS = [
  { id: 'google', label: 'Google', Icon: GoogleIcon },
  { id: 'apple', label: 'Apple', Icon: AppleIcon },
  { id: 'kakao', label: 'Kakao', Icon: KakaoIcon },
]

/**
 * Pantalla de autenticación: login + registro en una sola vista con pestañas.
 * Incluye botones sociales simulados y un acceso rápido con la cuenta demo.
 */
export function Login() {
  const { login, register, socialLogin, error, clearError, isSubmitting } = useAuth()
  const toast = useToast()

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [pendingSocial, setPendingSocial] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [fieldErrors, setFieldErrors] = useState({})

  // Limpiamos el error global al cambiar de pestaña.
  useEffect(() => {
    clearError()
    setFieldErrors({})
  }, [mode, clearError])

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate() {
    const errors = {}
    const email = form.email.trim()

    if (!email) errors.email = 'Ingresa tu correo.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Correo no válido.'

    if (!form.password) errors.password = 'Ingresa tu contraseña.'
    else if (form.password.length < 6) errors.password = 'Mínimo 6 caracteres.'

    if (mode === 'register') {
      if (!form.name.trim()) errors.name = 'Ingresa tu nombre completo.'
      else if (form.name.trim().length < 3) errors.name = 'Nombre demasiado corto.'
      if (form.confirm !== form.password) errors.confirm = 'Las contraseñas no coinciden.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    try {
      if (mode === 'login') {
        const user = await login({ email: form.email.trim(), password: form.password })
        toast.success(`¡Bienvenido de nuevo, ${user.name}!`, {
          description: 'Tu entrada para Lima te está esperando.',
        })
      } else {
        const user = await register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        })
        toast.success(`¡Cuenta creada, ${user.name}!`, {
          description: 'Ya eres parte del ARMY Pass.',
        })
      }
    } catch {
      /* el mensaje ya se muestra desde `error` del contexto */
    }
  }

  async function handleSocial(provider) {
    setPendingSocial(provider)
    try {
      const user = await socialLogin(provider)
      toast.success(`Sesión iniciada con ${provider}`, { description: user.email })
    } catch {
      /* idem */
    } finally {
      setPendingSocial(null)
    }
  }

  function fillDemo() {
    setForm((prev) => ({
      ...prev,
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    }))
    setMode('login')
    setFieldErrors({})
    toast.info('Credenciales de demo cargadas', { description: 'Solo pulsa “Iniciar sesión”.' })
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-brand-50 dark:bg-ink-950">
      {/* Fondo decorativo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 size-72 rounded-full bg-brand-400/30 blur-3xl dark:bg-brand-600/25" />
        <div className="absolute -bottom-32 -right-20 size-80 rounded-full bg-accent-400/25 blur-3xl dark:bg-accent-500/20" />
        <div className="absolute left-1/2 top-1/3 size-64 -translate-x-1/2 rounded-full bg-brand-300/20 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="absolute right-4 top-4 z-20 safe-top">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-6xl lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8">
        {/* ----------------------- Panel promocional ----------------------- */}
        <aside className="hidden flex-col justify-center p-8 lg:flex">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-100 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Entradas oficiales
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink-900 dark:text-white">
            {FEATURED_EVENT.tour}
            <span className="mt-2 block text-gradient">Lima, Perú</span>
          </h1>

          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-700/80 dark:text-ink-100/70">
            Guarda tu entrada digital, revisa tu puerta de ingreso y llega listo al Estadio
            Nacional. Todo en un solo lugar.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              { icon: ShieldCheck, text: 'QR dinámico que se renueva cada 30 segundos.' },
              { icon: Music4, text: 'Guía del show: transporte, puertas y horarios.' },
              { icon: Sparkles, text: 'Historial de compras y preferencias de tu cuenta.' },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-white text-brand-600 shadow-sm dark:bg-white/10 dark:text-brand-300">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-ink-700 dark:text-ink-100/80">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </aside>

        {/* -------------------------- Formulario --------------------------- */}
        <main className="flex w-full flex-col justify-center px-5 py-10 sm:px-8 lg:px-0">
          <div className="mx-auto w-full max-w-md">
            {/* Logo (visible sobre todo en móvil) */}
            <div className="mb-8 flex flex-col items-center text-center lg:hidden">
              <span className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-glow">
                <Music4 className="size-8 text-white" aria-hidden="true" />
              </span>
              <h1 className="mt-4 font-display text-2xl font-extrabold text-ink-900 dark:text-white">
                ARMY Pass
              </h1>
              <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-100/60">
                BTS World Tour 2026 · Lima, Perú
              </p>
            </div>

            <div className="rounded-3xl border border-brand-100 bg-white/90 p-6 shadow-xl shadow-brand-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-ink-900/80 dark:shadow-black/40 sm:p-8">
              {/* Pestañas */}
              <div
                className="relative mb-6 grid grid-cols-2 gap-1 rounded-2xl bg-brand-100/70 p-1 dark:bg-white/5"
                role="tablist"
              >
                {[
                  { id: 'login', label: 'Iniciar sesión' },
                  { id: 'register', label: 'Crear cuenta' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={mode === tab.id}
                    onClick={() => setMode(tab.id)}
                    className={cn(
                      'relative z-10 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300',
                      mode === tab.id
                        ? 'bg-white text-brand-700 shadow-sm dark:bg-ink-800 dark:text-white'
                        : 'text-ink-700/60 hover:text-ink-900 dark:text-ink-100/50 dark:hover:text-white',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <h2 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
                {mode === 'login' ? 'Hola de nuevo 👋' : 'Únete al ARMY 💜'}
              </h2>
              <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-100/60">
                {mode === 'login'
                  ? 'Ingresa para ver tu entrada digital.'
                  : 'Crea tu cuenta y guarda tus entradas.'}
              </p>

              {/* Error global */}
              {error && (
                <div
                  role="alert"
                  className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-800 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-200"
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                {mode === 'register' && (
                  <Field
                    id="name"
                    label="Nombre completo"
                    icon={User}
                    type="text"
                    placeholder="Jean Pierre Mescua"
                    autoComplete="name"
                    value={form.name}
                    onChange={update('name')}
                    error={fieldErrors.name}
                  />
                )}

                <Field
                  id="email"
                  label="Correo electrónico"
                  icon={AtSign}
                  type="email"
                  inputMode="email"
                  placeholder="tucorreo@army.pe"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  error={fieldErrors.email}
                />

                <Field
                  id="password"
                  label="Contraseña"
                  icon={Lock}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={form.password}
                  onChange={update('password')}
                  error={fieldErrors.password}
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="rounded-lg p-1.5 text-ink-700/50 transition hover:text-brand-600 dark:text-ink-100/40 dark:hover:text-brand-300"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4.5" aria-hidden="true" />
                      ) : (
                        <Eye className="size-4.5" aria-hidden="true" />
                      )}
                    </button>
                  }
                />

                {mode === 'register' && (
                  <Field
                    id="confirm"
                    label="Confirmar contraseña"
                    icon={Lock}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={update('confirm')}
                    error={fieldErrors.confirm}
                  />
                )}

                {mode === 'login' && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700/80 dark:text-ink-100/70">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="size-4 rounded border-brand-300 text-brand-600 focus:ring-brand-500 dark:border-white/20 dark:bg-white/10"
                      />
                      Recordarme
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        toast.info('Función de demo', {
                          description: 'La recuperación de contraseña no está habilitada.',
                        })
                      }
                      className="text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-300 dark:hover:text-brand-200"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isSubmitting && !pendingSocial}
                  rightIcon={ArrowRight}
                  className="mt-2"
                >
                  {mode === 'login' ? 'Iniciar sesión' : 'Crear mi cuenta'}
                </Button>
              </form>

              {/* Separador */}
              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-brand-100 dark:bg-white/10" />
                <span className="text-xs font-medium uppercase tracking-wider text-ink-700/50 dark:text-ink-100/40">
                  o continúa con
                </span>
                <span className="h-px flex-1 bg-brand-100 dark:bg-white/10" />
              </div>

              {/* Social login (simulado) */}
              <div className="grid grid-cols-3 gap-3">
                {SOCIALS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSocial(label)}
                    disabled={isSubmitting}
                    className={cn(
                      'flex h-12 items-center justify-center gap-2 rounded-xl border transition-all duration-200',
                      'border-brand-200 bg-white text-ink-900 hover:border-brand-400 hover:shadow-md active:scale-[0.98]',
                      'dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-brand-400/50',
                      'disabled:cursor-not-allowed disabled:opacity-60',
                      pendingSocial === label && 'animate-pulse border-brand-400',
                    )}
                    aria-label={`Continuar con ${label}`}
                  >
                    <Icon />
                    <span className="hidden text-sm font-semibold sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              {/* Acceso demo */}
              <button
                type="button"
                onClick={fillDemo}
                className="mt-6 w-full rounded-xl border border-dashed border-brand-300 bg-brand-50/60 px-4 py-3 text-left transition hover:border-brand-500 hover:bg-brand-100/60 dark:border-brand-400/30 dark:bg-brand-500/5 dark:hover:bg-brand-500/10"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                  Cuenta de demostración
                </p>
                <p className="mt-1 font-mono text-xs text-ink-700/80 dark:text-ink-100/70">
                  {DEMO_USER.email} · {DEMO_USER.password}
                </p>
                <p className="mt-1 text-xs text-ink-700/60 dark:text-ink-100/50">
                  Toca aquí para autocompletar el formulario.
                </p>
              </button>
            </div>

            <p className="mt-6 text-center text-xs leading-relaxed text-ink-700/60 dark:text-ink-100/40">
              Proyecto de demostración con fines educativos. No está afiliado a BIGHIT MUSIC,
              HYBE ni a BTS.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

/** Campo de formulario con icono, etiqueta flotante y mensaje de error. */
function Field({ id, label, icon: Icon, error, trailing, ...inputProps }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-ink-900 dark:text-ink-100"
      >
        {label}
      </label>
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border bg-white px-3 transition-all duration-200',
          'focus-within:ring-2 focus-within:ring-brand-500/30',
          'dark:bg-white/5',
          error
            ? 'border-rose-400 focus-within:border-rose-500 dark:border-rose-400/60'
            : 'border-brand-200 focus-within:border-brand-500 dark:border-white/10 dark:focus-within:border-brand-400',
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              'size-4.5 shrink-0',
              error ? 'text-rose-500' : 'text-ink-700/40 dark:text-ink-100/40',
            )}
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          className="h-12 w-full bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-ink-700/35 dark:text-white dark:placeholder:text-ink-100/30"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...inputProps}
        />
        {trailing}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  )
}

export default Login
