import { forwardRef, useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { RefreshCw, ScanLine, ShieldCheck } from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import useRotatingToken from '../hooks/useRotatingToken.js'
import { cn } from '../lib/format.js'

/**
 * QR de acceso con token rotatorio (se renueva cada 30 s, como en los
 * sistemas antifraude reales). El <canvas> se expone con `ref` para poder
 * incrustarlo en la imagen descargable de la entrada.
 */
export const QrTicket = forwardRef(function QrTicket(
  { ticket, size = 200, showMeta = true, className },
  ref,
) {
  const { isDark } = useTheme()
  const { payload, nonce, secondsLeft, progress, rotate } = useRotatingToken(ticket.id, 30)
  const [flash, setFlash] = useState(false)

  // Pequeño destello al renovar el código.
  useEffect(() => {
    setFlash(true)
    const timer = setTimeout(() => setFlash(false), 450)
    return () => clearTimeout(timer)
  }, [nonce])

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div
        className={cn(
          'relative rounded-3xl bg-white p-4 shadow-lg shadow-brand-900/10 transition-all duration-300',
          flash && 'ring-4 ring-brand-400/60',
        )}
      >
        {/* Esquinas tipo visor de escáner */}
        <Corner className="left-1.5 top-1.5 border-l-2 border-t-2 rounded-tl-lg" />
        <Corner className="right-1.5 top-1.5 border-r-2 border-t-2 rounded-tr-lg" />
        <Corner className="bottom-1.5 left-1.5 border-b-2 border-l-2 rounded-bl-lg" />
        <Corner className="bottom-1.5 right-1.5 border-b-2 border-r-2 rounded-br-lg" />

        <QRCodeCanvas
          ref={ref}
          value={payload}
          size={size}
          level="M"
          marginSize={1}
          bgColor="#ffffff"
          fgColor={isDark ? '#2a0d5a' : '#120c1e'}
          title={`Código de acceso de la entrada ${ticket.id}`}
        />
      </div>

      {showMeta && (
        <div className="mt-4 w-full max-w-[260px]">
          {/* Barra de expiración */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100 dark:bg-white/10">
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-1000 ease-linear',
                progress > 0.33
                  ? 'bg-gradient-to-r from-brand-500 to-accent-500'
                  : 'bg-amber-500',
              )}
              style={{ width: `${Math.max(progress, 0) * 100}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-700/70 dark:text-ink-100/60">
              <ShieldCheck className="size-3.5 text-emerald-500" aria-hidden="true" />
              Se renueva en {secondsLeft}s
            </p>
            <button
              type="button"
              onClick={rotate}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-brand-600 transition hover:bg-brand-100 dark:text-brand-300 dark:hover:bg-white/10"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Actualizar
            </button>
          </div>

          <p className="mt-2 flex items-center justify-center gap-1.5 text-center font-mono text-[11px] uppercase tracking-wider text-ink-700/50 dark:text-ink-100/40">
            <ScanLine className="size-3.5" aria-hidden="true" />
            {nonce}
          </p>
        </div>
      )}
    </div>
  )
})

function Corner({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn('absolute size-5 border-brand-500/70', className)}
    />
  )
}

export default QrTicket
