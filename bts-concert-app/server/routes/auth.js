import express from 'express'
import {
  createSession,
  destroySession,
  hashPassword,
  publicUser,
  readDb,
  verifyPassword,
  writeDb,
} from '../db.js'
import requireAuth from '../middleware/auth.js'

const router = express.Router()

/** POST /api/auth/register */
router.post('/register', (req, res) => {
  const { name, email, password } = req.body ?? {}

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nombre, correo y contraseña son obligatorios.' })
  }
  if (String(password).length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' })
  }

  const db = readDb()
  const normalized = String(email).trim().toLowerCase()

  if (db.users.some((user) => user.email.toLowerCase() === normalized)) {
    return res.status(409).json({ message: 'Ese correo ya está registrado.' })
  }

  const template = db.users[0] ?? {}
  const newUser = {
    id: `usr-${Date.now().toString(36)}`,
    name: String(name).trim().split(' ')[0],
    lastName: String(name).trim().split(' ').slice(1).join(' '),
    fullName: String(name).trim(),
    email: normalized,
    passwordHash: hashPassword(password),
    document: 'No registrado',
    phone: 'No registrado',
    city: 'Lima, Perú',
    memberSince: new Date().toISOString().slice(0, 10),
    tier: 'ARMY Membership · Base',
    preferences: { ...(template.preferences ?? {}) },
  }

  db.users.push(newUser)

  // Para que la demo tenga contenido, clonamos las entradas del usuario base.
  const baseTickets = db.tickets.filter((ticket) => ticket.userId === template.id)
  baseTickets.forEach((ticket, index) => {
    db.tickets.push({
      ...ticket,
      id: `TCK-2026-LIM-${Math.floor(1000 + Math.random() * 8999)}`,
      userId: newUser.id,
      holderName: index === 0 ? newUser.fullName : ticket.holderName,
    })
  })

  db.purchases
    .filter((purchase) => purchase.userId === template.id)
    .forEach((purchase) => {
      db.purchases.push({ ...purchase, userId: newUser.id })
    })

  writeDb(db)

  const token = createSession(newUser.id)
  return res.status(201).json({ user: publicUser(newUser), token })
})

/** POST /api/auth/login */
router.post('/login', (req, res) => {
  const { email, password } = req.body ?? {}

  if (!email || !password) {
    return res.status(400).json({ message: 'Ingresa tu correo y contraseña.' })
  }

  const db = readDb()
  const normalized = String(email).trim().toLowerCase()
  const user = db.users.find((item) => item.email.toLowerCase() === normalized)

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Correo o contraseña incorrectos.' })
  }

  const token = createSession(user.id)
  return res.json({ user: publicUser(user), token })
})

/** POST /api/auth/social — inicio de sesión social SIMULADO (solo demo). */
router.post('/social', (req, res) => {
  const { provider = 'Google' } = req.body ?? {}
  const db = readDb()
  const user = db.users[0]

  if (!user) return res.status(500).json({ message: 'No hay usuarios en la base de datos.' })

  const token = createSession(user.id)
  return res.json({ user: { ...publicUser(user), provider }, token })
})

/** GET /api/auth/me */
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) })
})

/** POST /api/auth/logout */
router.post('/logout', requireAuth, (req, res) => {
  destroySession(req.token)
  res.json({ ok: true })
})

export default router
