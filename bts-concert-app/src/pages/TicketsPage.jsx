import { useState } from 'react'
import { History, Ticket as TicketIcon } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { SectionTitle } from '../components/ui/Card.jsx'
import Badge from '../components/ui/Badge.jsx'
import TicketCard from '../components/TicketCard.jsx'
import PurchaseHistory from '../components/PurchaseHistory.jsx'
import { cn } from '../lib/format.js'

/** Listado completo de entradas + historial de compras. */
export function TicketsPage() {
  const { tickets, purchases, event } = useData()
  const [tab, setTab] = useState('activas')

  const tabs = [
    { id: 'activas', label: 'Entradas', count: tickets.length, icon: TicketIcon },
    { id: 'historial', label: 'Historial', count: purchases.length, icon: History },
  ]

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-extrabold text-ink-900 dark:text-white">
          Mis Tickets
        </h1>
        <p className="mt-1 text-sm text-ink-700/70 dark:text-ink-100/60">
          Entradas digitales asociadas a tu cuenta.
        </p>
      </header>

      {/* Pestañas */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-brand-100/70 p-1 dark:bg-white/5">
        {tabs.map(({ id, label, count, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-pressed={tab === id}
            className={cn(
              'flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all duration-300',
              tab === id
                ? 'bg-white text-brand-700 shadow-sm dark:bg-ink-800 dark:text-white'
                : 'text-ink-700/60 hover:text-ink-900 dark:text-ink-100/50 dark:hover:text-white',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
            <span className="rounded-full bg-brand-500/15 px-1.5 text-[11px] font-bold text-brand-700 dark:text-brand-200">
              {count}
            </span>
          </button>
        ))}
      </div>

      {tab === 'activas' ? (
        <section className="space-y-5">
          {tickets.length === 0 && (
            <p className="rounded-card border border-dashed border-brand-200 px-4 py-10 text-center text-sm text-ink-700/60 dark:border-white/10 dark:text-ink-100/50">
              No tienes entradas activas.
            </p>
          )}

          {tickets.map((ticket, index) => (
            <div key={ticket.id}>
              {index > 0 && (
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-brand-100 dark:bg-white/10" />
                  <Badge tone="neutral">Entrada {index + 1}</Badge>
                  <span className="h-px flex-1 bg-brand-100 dark:bg-white/10" />
                </div>
              )}
              <TicketCard ticket={ticket} event={event} />
            </div>
          ))}
        </section>
      ) : (
        <section>
          <SectionTitle icon={History}>Historial de compras</SectionTitle>
          <PurchaseHistory purchases={purchases} />
        </section>
      )}
    </div>
  )
}

export default TicketsPage
