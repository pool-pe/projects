import { getUserByToken } from '../db.js'

/**
 * Lee el header `Authorization: Bearer <token>` y adjunta `req.user`.
 * Si el token no es válido responde 401.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null

  const user = getUserByToken(token)
  if (!user) {
    return res.status(401).json({ message: 'Sesión no válida o expirada.' })
  }

  req.user = user
  req.token = token
  return next()
}

export default requireAuth
