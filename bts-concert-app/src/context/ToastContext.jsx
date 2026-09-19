import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '../lib/format.js'

const ToastContext = createContext(null)

const ICONS = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
}

const STYLES = {
  success:
    'border-emerald-300/70 bg-emerald-50 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-100',
  error:
    'border-rose-300/70 bg-rose-50 text-rose-900 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-100',
  info: 'border-brand-300/70 bg-white text-ink-900 dark:border-brand-400/30 dark:bg-ink-800 dark:text-ink-50',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const toast = useCallback(
    (message, { type = 'info', duration = 3500, description } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => [...prev.slice(-2), { id, message, description, type }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), duration),
      )
      return id
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({
      toast,
      success: (message, options) => toast(message, { ...options, type: 'success' }),
      error: (message, options) => toast(message, { ...options, type: 'error' }),
      info: (message, options) => toast(message, { ...options, type: 'info' }),
      dismiss,
    }),
    [toast, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Contenedor de notificaciones: abajo en móvil, arriba a la derecha en desktop */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:items-end"
        role="status"
        aria-live="polite"
      >
        {toasts.map((item) => {
          const Icon = ICONS[item.type] ?? Info
          return (
            <div
              key={item.id}
              className={cn(
                'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg shadow-brand-900/10 backdrop-blur-xl',
                'animate-toast-in',
                STYLES[item.type] ?? STYLES.info,
              )}
            >
              <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug">{item.message}</p>
                {item.description && (
                  <p className="mt-0.5 text-xs opacity-80">{item.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="rounded-lg p-1 opacity-60 transition hover:opacity-100"
                aria-label="Cerrar notificación"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return context
}

export default ToastContext
