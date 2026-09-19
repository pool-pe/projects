import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/format.js'

/**
 * Modal accesible:
 *  - se cierra con Escape y con click en el backdrop
 *  - bloquea el scroll del body mientras está abierto
 *  - en móvil aparece como hoja inferior (bottom sheet)
 */
export function Modal({ open, onClose, title, description, children, footer, size = 'md' }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Enfocamos el panel para que los lectores de pantalla anuncien el diálogo.
    const focusTimer = setTimeout(() => panelRef.current?.focus(), 30)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      clearTimeout(focusTimer)
    }
  }, [open, onClose])

  if (!open) return null

  const sizes = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
  }

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink-950/70 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          'relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl border border-brand-100 bg-white shadow-2xl outline-none',
          'dark:border-white/10 dark:bg-ink-900',
          'sm:rounded-3xl',
          sizes[size],
        )}
      >
        {/* Asa visual del bottom sheet (solo móvil) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <span className="h-1.5 w-12 rounded-full bg-ink-900/15 dark:bg-white/20" />
        </div>

        <div className="flex items-start justify-between gap-4 px-5 pb-3 pt-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ink-900 dark:text-ink-50">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-100/60">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 rounded-xl p-2 text-ink-700/60 transition hover:bg-brand-100 hover:text-ink-900 dark:text-ink-100/60 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Cerrar diálogo"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>

        {footer && (
          <div className="safe-bottom border-t border-brand-100 bg-brand-50/60 px-5 py-4 dark:border-white/10 dark:bg-ink-950/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default Modal
