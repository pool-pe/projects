/**
 * Cliente de la API.
 *
 * Estrategia "offline-first": intenta hablar con el backend Express
 * (http://localhost:4000 vía el proxy /api de Vite). Si el backend no está
 * levantado, cae automáticamente a la base simulada de `src/data/mockDb.js`,
 * de modo que la app SIEMPRE funciona aunque solo corras `npm run dev`.
 */

import {
  DEMO_USER,
  buildMockBootstrap,
  CONCERT_GUIDE,
  FEATURED_EVENT,
  NOTIFICATIONS,
  PURCHASES,
  TICKETS,
} from '../data/mockDb.js'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'
const REQUEST_TIMEOUT = 4000

/** Estado del backend: null = sin comprobar, true = vivo, false = caído. */
let backendAlive = null

/** Lo exponemos para que la UI pueda mostrar el badge "API conectada / modo demo". */
export function getBackendStatus() {
  return backendAlive
}

/** fetch con timeout: si el backend no responde en 4 s, abortamos y usamos el mock. */
async function request(path, options = {}) {
  const { token, headers, ...fetchOptions } = options
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      signal: controller.signal,
    })

    const isJson = response.headers.get('content-type')?.includes('application/json')
    const payload = isJson ? await response.json() : null

    if (!response.ok) {
      // Nuestra API SIEMPRE responde JSON (incluidos sus 404 y 500). Por tanto
      // una respuesta de error que no sea JSON significa que no hay API
      // detrás: el proxy de Vite devuelve 500 si el backend está apagado, y un
      // 404 en HTML si sirves el build sin proxy. En ambos casos: modo demo.
      if (!isJson) {
        backendAlive = false
        const offline = new Error('BACKEND_OFFLINE')
        offline.offline = true
        throw offline
      }

      const error = new Error(payload?.message ?? `Error ${response.status}`)
      error.status = response.status
      error.handled = true // el backend respondió con JSON: es un error real
      throw error
    }

    backendAlive = true
    return payload
  } catch (error) {
    if (error.handled) throw error
    // Fallo de red / timeout / CORS -> el backend no está disponible
    backendAlive = false
    const offline = new Error('BACKEND_OFFLINE')
    offline.offline = true
    throw offline
  } finally {
    clearTimeout(timer)
  }
}

/** Simula latencia de red para que los estados de carga se aprecien. */
const delay = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms))

/* -------------------------------------------------------------------------
   Almacenamiento local de usuarios registrados (modo demo sin backend)
------------------------------------------------------------------------- */
const LOCAL_USERS_KEY = 'bts.users'

function readLocalUsers() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLocalUsers(users) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
  } catch {
    /* almacenamiento bloqueado: seguimos en memoria */
  }
}

function makeMockToken(userId) {
  return `demo.${userId}.${Math.random().toString(36).slice(2, 12)}`
}

function sanitize(user) {
  const { password, ...safe } = user
  return safe
}

/* -------------------------------------------------------------------------
   API pública
------------------------------------------------------------------------- */
export const api = {
  /** POST /auth/login */
  async login({ email, password }) {
    try {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
    } catch (error) {
      if (!error.offline) throw error

      // --- Fallback local ---
      await delay()
      const normalized = String(email).trim().toLowerCase()
      const candidates = [DEMO_USER, ...readLocalUsers()]
      const found = candidates.find((u) => u.email.toLowerCase() === normalized)

      if (!found || found.password !== password) {
        const err = new Error('Correo o contraseña incorrectos.')
        err.status = 401
        throw err
      }
      return { user: sanitize(found), token: makeMockToken(found.id) }
    }
  },

  /** POST /auth/register */
  async register({ name, email, password }) {
    try {
      return await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
    } catch (error) {
      if (!error.offline) throw error

      // --- Fallback local ---
      await delay()
      const normalized = String(email).trim().toLowerCase()
      const users = readLocalUsers()

      if (
        normalized === DEMO_USER.email.toLowerCase() ||
        users.some((u) => u.email.toLowerCase() === normalized)
      ) {
        const err = new Error('Ese correo ya está registrado.')
        err.status = 409
        throw err
      }

      const newUser = {
        ...DEMO_USER,
        id: `usr-${Date.now().toString(36)}`,
        name: name.split(' ')[0],
        fullName: name,
        email: normalized,
        password,
        memberSince: new Date().toISOString().slice(0, 10),
        tier: 'ARMY Membership · Base',
      }
      users.push(newUser)
      writeLocalUsers(users)
      return { user: sanitize(newUser), token: makeMockToken(newUser.id) }
    }
  },

  /** POST /auth/social — login simulado con Google / Apple / Kakao */
  async socialLogin(provider) {
    try {
      return await request('/auth/social', {
        method: 'POST',
        body: JSON.stringify({ provider }),
      })
    } catch (error) {
      if (!error.offline) throw error
      await delay(700)
      return {
        user: { ...sanitize(DEMO_USER), provider },
        token: makeMockToken(DEMO_USER.id),
      }
    }
  },

  /** GET /bootstrap — evento + entradas + compras + guía + notificaciones */
  async bootstrap(token, user) {
    try {
      return await request('/bootstrap', { token })
    } catch (error) {
      if (!error.offline) throw error
      await delay(350)
      return buildMockBootstrap(user ?? DEMO_USER)
    }
  },

  /** GET /events/featured */
  async getFeaturedEvent(token) {
    try {
      return await request('/events/featured', { token })
    } catch (error) {
      if (!error.offline) throw error
      await delay(200)
      return FEATURED_EVENT
    }
  },

  /** GET /tickets */
  async getTickets(token) {
    try {
      return await request('/tickets', { token })
    } catch (error) {
      if (!error.offline) throw error
      await delay(250)
      return TICKETS
    }
  },

  /** GET /purchases */
  async getPurchases(token) {
    try {
      return await request('/purchases', { token })
    } catch (error) {
      if (!error.offline) throw error
      await delay(250)
      return PURCHASES
    }
  },

  /** GET /guide */
  async getGuide(token) {
    try {
      return await request('/guide', { token })
    } catch (error) {
      if (!error.offline) throw error
      return CONCERT_GUIDE
    }
  },

  /** GET /notifications */
  async getNotifications(token) {
    try {
      return await request('/notifications', { token })
    } catch (error) {
      if (!error.offline) throw error
      return NOTIFICATIONS
    }
  },

  /** PATCH /users/me/preferences */
  async updatePreferences(token, preferences) {
    try {
      return await request('/users/me/preferences', {
        method: 'PATCH',
        token,
        body: JSON.stringify(preferences),
      })
    } catch (error) {
      if (!error.offline) throw error
      await delay(200)
      return { preferences }
    }
  },

  /** GET /tickets/:id/validation — token rotatorio del QR */
  async refreshTicketToken(token, ticketId) {
    try {
      return await request(`/tickets/${ticketId}/validation`, { token })
    } catch (error) {
      if (!error.offline) throw error
      return {
        ticketId,
        nonce: Math.random().toString(36).slice(2, 10).toUpperCase(),
        issuedAt: new Date().toISOString(),
        expiresIn: 30,
      }
    }
  },
}

export default api
