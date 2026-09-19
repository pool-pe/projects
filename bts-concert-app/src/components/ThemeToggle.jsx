import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import { cn } from '../lib/format.js'

/** Interruptor de modo claro / oscuro. */
export function ThemeToggle({ className }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={isDark}
      className={cn(
        'relative grid size-10 place-items-center rounded-xl border transition-all duration-300',
        'border-brand-200 bg-white/80 text-brand-600 hover:border-brand-400 hover:text-brand-700',
        'dark:border-white/10 dark:bg-white/5 dark:text-amber-300 dark:hover:border-amber-300/40',
        className,
      )}
    >
      <Sun
        className={cn(
          'absolute size-5 transition-all duration-300',
          isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100',
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          'absolute size-5 transition-all duration-300',
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0',
        )}
        aria-hidden="true"
      />
    </button>
  )
}

export default ThemeToggle
