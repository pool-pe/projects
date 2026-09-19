import { cn } from '../../lib/format.js'

/** Bloque de carga con efecto shimmer. */
export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-brand-100/80 dark:bg-white/[0.07]',
        className,
      )}
      aria-hidden="true"
    />
  )
}

/** Esqueleto del dashboard mientras llega la respuesta de la API. */
export function DashboardSkeleton() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-56 w-full rounded-card sm:h-64" />
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-80 w-full rounded-card" />
      <Skeleton className="h-40 w-full rounded-card" />
    </div>
  )
}

export default Skeleton
