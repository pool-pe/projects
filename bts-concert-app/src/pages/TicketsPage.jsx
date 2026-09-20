import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TicketX } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import MyTicketsHeader from '../components/MyTicketsHeader.jsx'
import TicketListItem, {
  formatMonthLabel,
  groupTickets,
} from '../components/TicketListItem.jsx'

/**
 * Pantalla "Mis Entradas".
 *
 * Réplica de la app original: cabecera con título e iconos, control segmentado
 * Próximos/Pasados, encabezado de mes y la fila del evento con su afiche.
 */
export function TicketsPage() {
  const { tickets, event, transferredCount, restoreTickets } = useData()
  const navigate = useNavigate()
  const [tab, setTab] = useState('proximos')

  const groups = useMemo(() => {
    if (!event) return []
    const now = Date.now()
    return groupTickets(tickets, event).filter((group) => {
      const isPast = new Date(group.dateISO).getTime() < now
      return tab === 'pasados' ? isPast : !isPast
    })
  }, [tickets, event, tab])

  // Encabezados de mes: "Octubre 2026"
  const months = useMemo(() => {
    const map = new Map()
    groups.forEach((group) => {
      const { month, year } = formatMonthLabel(group.dateISO)
      const key = `${month} ${year}`
      if (!map.has(key)) map.set(key, { month, year, groups: [] })
      map.get(key).groups.push(group)
    })
    return [...map.values()]
  }, [groups])

  return (
    <div className="min-h-dvh bg-app-bg font-native">
      <MyTicketsHeader tab={tab} onTabChange={setTab} />

      <div className="px-4 pb-28">
        {months.length === 0 ? (
          <EmptyState
            tab={tab}
            transferredCount={transferredCount}
            onRestore={restoreTickets}
          />
        ) : (
          months.map(({ month, year, groups: monthGroups }) => (
            <section key={`${month}-${year}`}>
              <h2 className="pt-[31px] text-[18px] leading-[24px]">
                <span className="font-bold text-white">{month}</span>{' '}
                <span className="font-normal text-app-soft">{year}</span>
              </h2>

              <div className="mt-[10px] space-y-[10px]">
                {monthGroups.map((group) => (
                  <TicketListItem
                    key={group.key}
                    group={group}
                    onClick={() => navigate(`/tickets/${group.event.id}`)}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  )
}

function EmptyState({ tab, transferredCount = 0, onRestore }) {
  const transferidas = tab !== 'pasados' && transferredCount > 0

  return (
    <div className="flex flex-col items-center justify-center pt-24 text-center">
      <TicketX className="size-10 text-app-icon/60" aria-hidden="true" />
      <p className="mt-4 text-[15px] font-semibold text-white">
        {tab === 'pasados' ? 'No tienes entradas pasadas' : 'No tienes entradas próximas'}
      </p>
      <p className="mt-1 text-[13px] text-app-muted">
        {transferidas
          ? `Transferiste ${transferredCount} ${transferredCount === 1 ? 'entrada' : 'entradas'}.`
          : 'Cuando compres una, aparecerá aquí.'}
      </p>

      {transferidas && (
        <button
          type="button"
          onClick={onRestore}
          className="mt-8 text-[12px] font-medium text-app-teal underline-offset-4 active:opacity-60"
        >
          Deshacer la transferencia (demo)
        </button>
      )}
    </div>
  )
}

export default TicketsPage
