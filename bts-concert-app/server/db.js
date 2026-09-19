/**
 * "Base de datos" en archivo JSON.
 *
 * Al arrancar, si no existe server/db.json se crea a partir de server/seed.json.
 * Cada escritura persiste el archivo completo (suficiente para una demo local;
 * en producción usarías PostgreSQL, Mongo, etc.).
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DB_PATH = path.join(__dirname, 'db.json')
const SEED_PATH = path.join(__dirname, 'seed.json')

let cache = null

/* ------------------------------- Lectura ------------------------------- */

export function readDb() {
  if (cache) return cache

  if (!fs.existsSync(DB_PATH)) {
    resetDb()
  }

  try {
    cache = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
  } catch {
    console.warn('[db] db.json corrupto, regenerando desde seed.json')
    resetDb()
    cache = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
  }

  return cache
}

export function writeDb(data) {
  cache = data
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
  return cache
}

/** Regenera db.json desde seed.json (hashea la contraseña del usuario demo). */
export function resetDb() {
  const seed = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'))

  seed.users = seed.users.map((user) => {
    if (user.password && !user.passwordHash) {
      const { password, ...rest } = user
      return { ...rest, passwordHash: hashPassword(password) }
    }
    return user
  })

  seed.sessions = []
  cache = seed
  fs.writeFileSync(DB_PATH, JSON.stringify(seed, null, 2), 'utf8')
  return seed
}

/* ------------------------------ Contraseñas ---------------------------- */

/** scrypt + salt aleatoria -> "salt:hash" (nunca guardamos texto plano). */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(String(password), salt, 64).toString('hex')
  return `${salt}:${derived}`
}

/** Comparación en tiempo constante para evitar timing attacks. */
export function verifyPassword(password, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false
  const [salt, hash] = stored.split(':')
  const derived = crypto.scryptSync(String(password), salt, 64)
  const expected = Buffer.from(hash, 'hex')
  if (expected.length !== derived.length) return false
  return crypto.timingSafeEqual(expected, derived)
}

/* -------------------------------- Tokens ------------------------------- */

export function createSession(userId) {
  const db = readDb()
  const token = crypto.randomBytes(24).toString('hex')

  db.sessions = [
    ...(db.sessions ?? []).filter((session) => session.userId !== userId),
    { token, userId, createdAt: new Date().toISOString() },
  ]

  writeDb(db)
  return token
}

export function getUserByToken(token) {
  if (!token) return null
  const db = readDb()
  const session = (db.sessions ?? []).find((item) => item.token === token)
  if (!session) return null
  return db.users.find((user) => user.id === session.userId) ?? null
}

export function destroySession(token) {
  const db = readDb()
  db.sessions = (db.sessions ?? []).filter((session) => session.token !== token)
  writeDb(db)
}

/** Quita campos sensibles antes de enviar el usuario al cliente. */
export function publicUser(user) {
  if (!user) return null
  const { passwordHash, password, ...safe } = user
  return safe
}
