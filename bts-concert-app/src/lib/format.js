/** Helpers de formato en español peruano (es-PE). */

const LIMA_TZ = 'America/Lima'

/** "sábado, 14 de noviembre de 2026" */
export function formatLongDate(iso) {
  return capitalize(
    new Date(iso).toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: LIMA_TZ,
    }),
  )
}

/** "14 nov 2026" */
export function formatShortDate(iso) {
  return new Date(iso).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: LIMA_TZ,
  })
}

/** "14 nov 2026, 10:24" */
export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: LIMA_TZ,
  })
}

/** "20:00" */
export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: LIMA_TZ,
  })
}

/** { day: "14", month: "NOV", year: "2026" } para el bloque tipo calendario */
export function splitDateParts(iso) {
  const date = new Date(iso)
  return {
    day: date.toLocaleDateString('es-PE', { day: '2-digit', timeZone: LIMA_TZ }),
    month: date
      .toLocaleDateString('es-PE', { month: 'short', timeZone: LIMA_TZ })
      .replace('.', '')
      .toUpperCase(),
    year: date.toLocaleDateString('es-PE', { year: 'numeric', timeZone: LIMA_TZ }),
    weekday: capitalize(
      date.toLocaleDateString('es-PE', { weekday: 'long', timeZone: LIMA_TZ }),
    ),
  }
}

/** "S/ 890.00" */
export function formatMoney(amount, currency = 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

/** Pone en mayúscula la primera letra. */
export function capitalize(text = '') {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** "JP" a partir de "Jean Pierre Mescua" */
export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
}

/** Saludo dependiente de la hora local del dispositivo. */
export function getGreeting(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

/** Une clases condicionales sin dependencias externas (mini `clsx`). */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
