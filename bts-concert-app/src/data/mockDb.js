/**
 * Base de datos simulada del frontend.
 *
 * Se usa en dos situaciones:
 *  1. Cuando el backend Express NO está levantado (modo 100% offline).
 *  2. Como semilla del backend (server/seed.json replica esta estructura).
 *
 * Todos los datos son ficticios y sirven solo para la demo.
 */

/** Fecha/hora oficial del show en hora de Lima (UTC-5). */
export const EVENT_DATE_ISO = '2026-11-14T20:00:00-05:00'

/** Apertura de puertas (2 horas antes del show). */
export const DOORS_OPEN_ISO = '2026-11-14T18:00:00-05:00'

export const FEATURED_EVENT = {
  id: 'evt-bts-lima-2026',
  tour: 'BTS World Tour 2026',
  title: 'BTS World Tour 2026',
  subtitle: '“Permission to Dance On Stage” · Lima',
  city: 'Lima, Perú',
  venue: 'Estadio Nacional',
  venueAddress: 'Jr. José Díaz s/n, Cercado de Lima',
  dateISO: EVENT_DATE_ISO,
  doorsOpenISO: DOORS_OPEN_ISO,
  showTimeLabel: '20:00 h',
  doorsLabel: '18:00 h',
  capacity: 45000,
  lineup: ['RM', 'Jin', 'SUGA', 'j-hope', 'Jimin', 'V', 'Jung Kook'],
  heroTagline: 'La séptima parada del tour mundial aterriza en Sudamérica',
  status: 'SOLD_OUT',
  // Degradado del banner (clases de Tailwind, se inyectan en el componente)
  gradient: 'from-brand-600 via-brand-500 to-accent-500',
}

export const DEMO_USER = {
  id: 'usr-001',
  name: 'Jean Pierre',
  lastName: 'Mescua',
  fullName: 'Jean Pierre Mescua',
  email: 'jeanpierre@army.pe',
  // La contraseña de demo es "bts2026" (el backend guarda un hash real).
  password: 'bts2026',
  document: 'DNI 70 *** 418',
  phone: '+51 9** *** 214',
  city: 'Lima, Perú',
  memberSince: '2019-06-12',
  tier: 'ARMY Membership · Gold',
  avatarInitials: 'JP',
  preferences: {
    notifications: true,
    emailUpdates: true,
    darkMode: true,
    language: 'es-PE',
    newsletter: false,
  },
}

export const TICKETS = [
  {
    id: 'TCK-2026-LIM-0418',
    eventId: 'evt-bts-lima-2026',
    userId: 'usr-001',
    holderName: 'Jean Pierre Mescua',
    zone: 'VIP · Campo A',
    zoneShort: 'Campo A',
    gate: 'Puerta 4 — Norte',
    sector: 'Bloque A2',
    seat: 'Zona de pie (sin numerar)',
    row: '—',
    status: 'CONFIRMADO',
    price: 890,
    currency: 'PEN',
    purchaseDate: '2026-03-02T10:24:00-05:00',
    orderId: 'ORD-93412-LIM',
    paymentMethod: 'Visa •••• 4821',
    transferable: true,
    includes: [
      'Acceso preferente al Campo A',
      'Merch pack oficial ARMY',
      'Ingreso anticipado 17:00 h',
      'Zona de descanso VIP',
    ],
  },
  {
    id: 'TCK-2026-LIM-0419',
    eventId: 'evt-bts-lima-2026',
    userId: 'usr-001',
    holderName: 'Ana Lucía Rojas',
    zone: 'Tribuna Occidente',
    zoneShort: 'Occidente',
    gate: 'Puerta 9 — Oeste',
    sector: 'Sector OC-12',
    seat: 'Asiento 18',
    row: 'Fila 7',
    status: 'CONFIRMADO',
    price: 520,
    currency: 'PEN',
    purchaseDate: '2026-03-02T10:24:00-05:00',
    orderId: 'ORD-93412-LIM',
    paymentMethod: 'Visa •••• 4821',
    transferable: true,
    includes: ['Asiento numerado', 'Acceso por Puerta 9'],
  },
]

export const PURCHASES = [
  {
    id: 'ORD-93412-LIM',
    concept: 'BTS World Tour 2026 — Lima',
    detail: '2 entradas (VIP Campo A + Tribuna Occidente)',
    date: '2026-03-02T10:24:00-05:00',
    amount: 1410,
    currency: 'PEN',
    status: 'PAGADO',
    method: 'Visa •••• 4821',
  },
  {
    id: 'ORD-88170-MER',
    concept: 'Merchandising oficial',
    detail: 'Light Stick ARMY Bomb Ver. 4 + Photobook',
    date: '2026-02-14T19:05:00-05:00',
    amount: 340,
    currency: 'PEN',
    status: 'ENTREGADO',
    method: 'Yape',
  },
  {
    id: 'ORD-77105-FAN',
    concept: 'BTS Fan Meeting 2025',
    detail: '1 entrada — Arena 1 (Lima)',
    date: '2025-11-08T21:40:00-05:00',
    amount: 260,
    currency: 'PEN',
    status: 'USADO',
    method: 'Visa •••• 4821',
  },
]

/** Bloques de la guía del día del concierto. */
export const CONCERT_GUIDE = [
  {
    id: 'transporte',
    icon: 'bus',
    title: 'Cómo llegar',
    accent: 'brand',
    summary: 'Estadio Nacional — Jr. José Díaz s/n, Cercado de Lima',
    items: [
      'Metropolitano: bajar en la estación “Estadio Nacional” (5 min a pie a la Puerta 4).',
      'Metro Línea 1: estación Grau + transbordo al Metropolitano.',
      'Apps de taxi: pide el punto de encuentro en el Parque de la Reserva, no en la puerta.',
      'No hay estacionamiento público en el estadio. Llega con 2 h de anticipación.',
    ],
  },
  {
    id: 'horarios',
    icon: 'clock',
    title: 'Horarios del día',
    accent: 'accent',
    summary: 'Sábado 14 de noviembre de 2026',
    items: [
      '15:00 h — Apertura de stands de merchandising oficial.',
      '17:00 h — Ingreso anticipado exclusivo VIP (Campo A).',
      '18:00 h — Apertura general de puertas.',
      '20:00 h — Inicio del show. Las puertas se cierran 21:00 h.',
    ],
  },
  {
    id: 'permitidos',
    icon: 'check',
    title: 'Objetos permitidos',
    accent: 'emerald',
    summary: 'Revisa tu mochila antes de salir',
    items: [
      'ARMY Bomb oficial y banners de tela (máx. 1 m).',
      'Botella de plástico vacía y sin tapa (hay puntos de hidratación).',
      'Cámara compacta sin lente desmontable.',
      'Power bank de hasta 10 000 mAh.',
    ],
  },
  {
    id: 'prohibidos',
    icon: 'ban',
    title: 'Objetos prohibidos',
    accent: 'rose',
    summary: 'Control de seguridad en todas las puertas',
    items: [
      'Cámaras profesionales, trípodes, GoPro y drones.',
      'Alimentos, bebidas alcohólicas y envases de vidrio.',
      'Sillas plegables, paraguas grandes y punteros láser.',
      'Mochilas mayores a 30 × 30 cm.',
    ],
  },
  {
    id: 'recomendaciones',
    icon: 'sparkles',
    title: 'Tips ARMY',
    accent: 'amber',
    summary: 'Para que el día salga perfecto',
    items: [
      'Lleva tu DNI o carné de extranjería: se valida junto con el QR.',
      'Descarga tu entrada antes de salir; la señal en el estadio se satura.',
      'Sincroniza tu ARMY Bomb en la app oficial al ingresar al campo.',
      'Noviembre en Lima es fresco de noche: lleva una casaca ligera.',
    ],
  },
]

/** Notificaciones simuladas para la campanita del header. */
export const NOTIFICATIONS = [
  {
    id: 'ntf-1',
    title: '¡Tu entrada ya está activa!',
    body: 'El QR de acceso para el Campo A se habilitó correctamente.',
    date: '2026-09-18T09:12:00-05:00',
    unread: true,
    type: 'ticket',
  },
  {
    id: 'ntf-2',
    title: 'Nuevo mapa del Estadio Nacional',
    body: 'Revisa tu puerta de ingreso y los puntos de hidratación.',
    date: '2026-09-15T17:45:00-05:00',
    unread: true,
    type: 'info',
  },
  {
    id: 'ntf-3',
    title: 'Merch oficial disponible',
    body: 'Reserva tu ARMY Bomb Ver. 4 antes del concierto.',
    date: '2026-09-10T12:00:00-05:00',
    unread: false,
    type: 'shop',
  },
]

/** Respuesta completa que devuelve el endpoint /api/bootstrap. */
export function buildMockBootstrap(user = DEMO_USER) {
  return {
    event: FEATURED_EVENT,
    tickets: TICKETS.map((t) => ({ ...t, holderName: t.holderName })),
    purchases: PURCHASES,
    guide: CONCERT_GUIDE,
    notifications: NOTIFICATIONS,
    user,
  }
}
