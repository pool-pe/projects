/**
 * Base de datos simulada del frontend.
 *
 * Se usa en dos situaciones:
 *  1. Cuando el backend Express NO está levantado (modo 100% offline).
 *  2. Como semilla del backend (server/seed.json replica esta estructura).
 *
 * Todos los datos son ficticios y sirven solo para la demo.
 */

/** Fecha/hora de la función a la que asiste el usuario (hora de Lima, UTC-5). */
export const EVENT_DATE_ISO = '2026-10-07T20:00:00-05:00'

/** Apertura de puertas (2 horas antes del show). */
export const DOORS_OPEN_ISO = '2026-10-07T18:00:00-05:00'

export const FEATURED_EVENT = {
  id: 'evt-bts-arirang-lima-2026',
  tour: "BTS WORLD TOUR 'ARIRANG'",
  title: "BTS WORLD TOUR 'ARIRANG'",
  subtitle: 'Lima · Estadio San Marcos',
  city: 'Lima, Perú',
  venue: 'Estadio San Marcos',
  venueAddress: 'Av. Venezuela cdra. 34, Ciudad Universitaria',
  dateISO: EVENT_DATE_ISO,
  doorsOpenISO: DOORS_OPEN_ISO,
  showTimeLabel: '20:00 h',
  doorsLabel: '18:00 h',
  capacity: 40000,
  poster: '/posters/bts-arirang.svg',
  lineup: ['RM', 'Jin', 'SUGA', 'j-hope', 'Jimin', 'V', 'Jung Kook'],
  heroTagline: 'El tour mundial aterriza en Lima por tres noches',
  /* Banda bajo el afiche en la pantalla de detalle */
  posterBandDate: '7 OCTUBRE 2026',
  purchasePolicyText: 'Revisa nuestras Políticas de Compra',
  purchasePolicyUrl: 'https://www.quentro.com/politica-de-compra',
  shortDateLabel: '7/10/26',
  status: 'SOLD_OUT',
  /** Las tres funciones del afiche oficial. */
  tourDates: [
    { iso: '2026-10-07T20:00:00-05:00', label: '07.10.2026', weekday: 'MIE' },
    { iso: '2026-10-09T20:00:00-05:00', label: '09.10.2026', weekday: 'VIE' },
    { iso: '2026-10-10T20:00:00-05:00', label: '10.10.2026', weekday: 'SÁB' },
  ],
  gradient: 'from-brand-700 via-brand-500 to-accent-500',
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

/** Datos comunes a las 4 entradas de la misma compra. */
const COMMON = {
  eventId: 'evt-bts-arirang-lima-2026',
  userId: 'usr-001',
  status: 'CONFIRMADO',
  currency: 'PEN',
  purchaseDate: '2026-03-02T10:24:00-05:00',
  orderId: 'ORD-93412-LIM',
  paymentMethod: 'Visa •••• 4821',
  transferable: true,
  // Campos que muestra la pantalla de detalle
  fare: 'PREVENTA ARMY MEMBERSHIP',
  section: 'CAMPO ACCESO A',
  row: 'Sin numerar',
  seat: '-',
  startTimeLabel: '20:00',
  price: 740,
  zone: 'CAMPO ACCESO A',
  zoneShort: 'Campo A',
}

export const TICKETS = [
  {
    ...COMMON,
    id: 'TCK-2026-SMC-0418',
    holderName: 'Jean Pierre Mescua',
    gate: 'Puerta 4 — Norte',
    includes: [
      'Acceso preferente al Campo A',
      'Merch pack oficial ARMY',
      'Ingreso anticipado 17:00 h',
      'Zona de descanso VIP',
    ],
  },
  {
    ...COMMON,
    id: 'TCK-2026-SMC-0419',
    holderName: 'Ana Lucía Rojas',
    gate: 'Puerta 4 — Norte',
    includes: ['Acceso preferente al Campo A', 'Merch pack oficial ARMY'],
  },
  {
    ...COMMON,
    id: 'TCK-2026-SMC-0420',
    holderName: 'Diego Mescua',
    gate: 'Puerta 6 — Este',
    includes: ['Acceso preferente al Campo A'],
  },
  {
    ...COMMON,
    id: 'TCK-2026-SMC-0421',
    holderName: 'Camila Vera',
    gate: 'Puerta 6 — Este',
    includes: ['Acceso preferente al Campo A'],
  },
]

export const PURCHASES = [
  {
    id: 'ORD-93412-LIM',
    concept: "BTS WORLD TOUR 'ARIRANG' — Lima",
    detail: '4 entradas — CAMPO ACCESO A (Preventa ARMY Membership)',
    date: '2026-03-02T10:24:00-05:00',
    amount: 2960,
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
    summary: 'Estadio San Marcos — Av. Venezuela cdra. 34',
    items: [
      'El estadio está dentro de la Ciudad Universitaria de la UNMSM (Av. Venezuela con Av. Universitaria).',
      'Corredor Azul y buses de Av. Venezuela dejan a 10 min a pie de la Puerta 4.',
      'Metro Línea 1: estación Grau y luego taxi o corredor hacia Av. Venezuela.',
      'Apps de taxi: usa la Puerta 1 de la Ciudad Universitaria como punto de encuentro.',
    ],
  },
  {
    id: 'horarios',
    icon: 'clock',
    title: 'Horarios del día',
    accent: 'accent',
    summary: 'Miércoles 7 de octubre de 2026',
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
      'Octubre en Lima es húmedo de noche: lleva una casaca ligera.',
    ],
  },
]

/** Notificaciones simuladas para la campanita del header. */
export const NOTIFICATIONS = [
  {
    id: 'ntf-1',
    title: '¡Tus entradas ya están activas!',
    body: 'Los 4 códigos QR de acceso se habilitaron correctamente.',
    date: '2026-09-18T09:12:00-05:00',
    unread: true,
    type: 'ticket',
  },
  {
    id: 'ntf-2',
    title: 'Nuevo mapa del Estadio San Marcos',
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
    tickets: TICKETS.map((t) => ({ ...t })),
    purchases: PURCHASES,
    guide: CONCERT_GUIDE,
    notifications: NOTIFICATIONS,
    user,
  }
}
