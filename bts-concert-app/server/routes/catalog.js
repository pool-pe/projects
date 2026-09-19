import crypto from 'node:crypto'
import express from 'express'
import { publicUser, readDb, writeDb } from '../db.js'
import requireAuth from '../middleware/auth.js'

const router = express.Router()

/** Entradas y compras del usuario autenticado (con respaldo al usuario base). */
function ownedBy(collection, userId, fallbackUserId) {
  const owned = collection.filter((item) => item.userId === userId)
  if (owned.length > 0) return owned
  return collection.filter((item) => item.userId === fallbackUserId)
}

/** GET /api/bootstrap — todo lo que el dashboard necesita en una sola llamada. */
router.get('/bootstrap', requireAuth, (req, res) => {
  const db = readDb()
  const baseId = db.users[0]?.id

  res.json({
    user: publicUser(req.user),
    event: db.events.find((event) => event.id === db.featuredEventId) ?? db.events[0],
    tickets: ownedBy(db.tickets, req.user.id, baseId),
    purchases: ownedBy(db.purchases, req.user.id, baseId),
    guide: db.guide,
    notifications: db.notifications,
  })
})

/** GET /api/events/featured */
router.get('/events/featured', (req, res) => {
  const db = readDb()
  res.json(db.events.find((event) => event.id === db.featuredEventId) ?? db.events[0])
})

/** GET /api/events */
router.get('/events', (req, res) => {
  res.json(readDb().events)
})

/** GET /api/tickets */
router.get('/tickets', requireAuth, (req, res) => {
  const db = readDb()
  res.json(ownedBy(db.tickets, req.user.id, db.users[0]?.id))
})

/** GET /api/tickets/:id */
router.get('/tickets/:id', requireAuth, (req, res) => {
  const db = readDb()
  const ticket = db.tickets.find((item) => item.id === req.params.id)
  if (!ticket) return res.status(404).json({ message: 'Entrada no encontrada.' })
  res.json(ticket)
})

/**
 * GET /api/tickets/:id/validation
 * Token rotatorio de un solo uso para el QR (caduca en 30 s).
 */
router.get('/tickets/:id/validation', requireAuth, (req, res) => {
  const db = readDb()
  const ticket = db.tickets.find((item) => item.id === req.params.id)
  if (!ticket) return res.status(404).json({ message: 'Entrada no encontrada.' })

  res.json({
    ticketId: ticket.id,
    nonce: crypto.randomBytes(6).toString('hex').toUpperCase(),
    issuedAt: new Date().toISOString(),
    expiresIn: 30,
  })
})

/** GET /api/purchases */
router.get('/purchases', requireAuth, (req, res) => {
  const db = readDb()
  res.json(ownedBy(db.purchases, req.user.id, db.users[0]?.id))
})

/** GET /api/guide */
router.get('/guide', (req, res) => {
  res.json(readDb().guide)
})

/** GET /api/notifications */
router.get('/notifications', requireAuth, (req, res) => {
  res.json(readDb().notifications)
})

/** PATCH /api/users/me/preferences */
router.patch('/users/me/preferences', requireAuth, (req, res) => {
  const db = readDb()
  const user = db.users.find((item) => item.id === req.user.id)
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' })

  user.preferences = { ...user.preferences, ...(req.body ?? {}) }
  writeDb(db)

  res.json({ preferences: user.preferences })
})

export default router
