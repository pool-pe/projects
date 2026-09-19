import { CreditCard, Receipt, Smartphone } from 'lucide-react'
import { cn, formatDateTime, formatMoney } from '../lib/format.js'
import Badge from './ui/Badge.jsx'

const STATUS_TONE = {
  PAGADO: 'success',
  ENTREGADO: 'brand',
  USADO: 'neutral',
  REEMBOLSADO: 'danger',
}

/** Historial de compras simulado de la cuenta. */
export function PurchaseHistory({ purchases = [] }) {
  if (purchases.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-brand-200 px-4 py-8 text-center text-sm text-ink-700/60 dark:border-white/10 dark:text-ink-100/50">
        Todavía no registras compras.
      </p>
    )
  }

  const total = purchases.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="space-y-2.5">
      {purchases.map((purchase) => {
        const Icon = purchase.method?.toLowerCase().includes('yape') ? Smartphone : CreditCard

        return (
          <article
            key={purchase.id}
            className="flex items-start gap-3 rounded-card border border-brand-100 bg-white p-4 transition hover:border-brand-300 dark:border-white/10 dark:bg-ink-900 dark:hover:border-brand-400/30"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
              <Receipt className="size-5" aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                <h3 className="font-display text-sm font-bold text-ink-900 dark:text-white">
                  {purchase.concept}
                </h3>
                <span className="font-display text-sm font-extrabold text-ink-900 dark:text-white">
                  {formatMoney(purchase.amount, purchase.currency)}
                </span>
              </div>

              <p className="mt-0.5 text-xs text-ink-700/70 dark:text-ink-100/60">
                {purchase.detail}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone={STATUS_TONE[purchase.status] ?? 'neutral'}>{purchase.status}</Badge>
                <span className="flex items-center gap-1 text-[11px] text-ink-700/55 dark:text-ink-100/45">
                  <Icon className="size-3.5" aria-hidden="true" />
                  {purchase.method}
                </span>
                <span className="text-[11px] text-ink-700/45 dark:text-ink-100/35">
                  {formatDateTime(purchase.date)}
                </span>
                <span className="font-mono text-[11px] text-ink-700/45 dark:text-ink-100/35">
                  {purchase.id}
                </span>
              </div>
            </div>
          </article>
        )
      })}

      <div
        className={cn(
          'flex items-center justify-between rounded-card border border-brand-200 bg-brand-50 px-4 py-3',
          'dark:border-brand-400/25 dark:bg-brand-500/10',
        )}
      >
        <span className="text-sm font-semibold text-ink-900 dark:text-white">
          Total histórico
        </span>
        <span className="font-display text-lg font-extrabold text-brand-700 dark:text-brand-200">
          {formatMoney(total, 'PEN')}
        </span>
      </div>
    </div>
  )
}

export default PurchaseHistory
