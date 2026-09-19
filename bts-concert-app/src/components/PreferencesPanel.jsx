import { Bell, Mail, Moon, Newspaper } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { cn } from '../lib/format.js'

const OPTIONS = [
  {
    key: 'notifications',
    icon: Bell,
    title: 'Notificaciones push',
    description: 'Avisos de tu entrada, puertas y cambios de horario.',
  },
  {
    key: 'emailUpdates',
    icon: Mail,
    title: 'Correos del evento',
    description: 'Recordatorios y confirmaciones al correo de tu cuenta.',
  },
  {
    key: 'newsletter',
    icon: Newspaper,
    title: 'Novedades y preventas',
    description: 'Entérate primero de nuevas fechas y merch oficial.',
  },
  {
    key: 'darkMode',
    icon: Moon,
    title: 'Modo oscuro',
    description: 'Aplica el tema oscuro en toda la aplicación.',
  },
]

/** Preferencias del usuario, persistidas junto a la sesión. */
export function PreferencesPanel() {
  const { user, updatePreferences } = useAuth()
  const { isDark, setTheme } = useTheme()
  const toast = useToast()

  const preferences = { ...user?.preferences, darkMode: isDark }

  async function handleToggle(key) {
    const nextValue = !preferences[key]

    if (key === 'darkMode') {
      setTheme(nextValue ? 'dark' : 'light')
    }

    await updatePreferences({ [key]: nextValue })
    toast.info(nextValue ? 'Preferencia activada' : 'Preferencia desactivada', {
      description: OPTIONS.find((option) => option.key === key)?.title,
      duration: 2000,
    })
  }

  return (
    <div className="space-y-2.5">
      {OPTIONS.map(({ key, icon: Icon, title, description }) => {
        const checked = Boolean(preferences[key])

        return (
          <div
            key={key}
            className="flex items-center gap-3 rounded-card border border-brand-100 bg-white p-4 dark:border-white/10 dark:bg-ink-900"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Icon className="size-5" aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-ink-900 dark:text-white">
                {title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-700/65 dark:text-ink-100/55">
                {description}
              </p>
            </div>

            {/* Switch accesible construido sobre un <button role="switch"> */}
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              aria-label={title}
              onClick={() => handleToggle(key)}
              className={cn(
                'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300',
                checked
                  ? 'bg-gradient-to-r from-brand-500 to-accent-500'
                  : 'bg-ink-900/15 dark:bg-white/15',
              )}
            >
              <span
                className={cn(
                  'absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all duration-300',
                  checked ? 'left-6' : 'left-1',
                )}
              />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default PreferencesPanel
