/**
 * API REST mock para la app del concierto.
 *
 *   npm run api        -> http://localhost:4000
 *   npm run dev:all    -> API + frontend a la vez
 *
 * El frontend nunca apunta a este puerto directamente: pide `/api/...` al
 * servidor de Vite y el proxy de vite.config.js lo reenvía aquí. Así la vista
 * previa desde el celular funciona sin configurar IPs.
 */

import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import catalogRoutes from './routes/catalog.js'
import { readDb } from './db.js'

const app = express()
const PORT = Number(process.env.PORT ?? 4000)

app.use(cors()) // demo local: permitimos cualquier origen
app.use(express.json())

// Log sencillo de peticiones
app.use((req, _res, next) => {
  console.log(`${new Date().toLocaleTimeString('es-PE')}  ${req.method} ${req.originalUrl}`)
  next()
})

app.get('/api/health', (_req, res) => {
  const db = readDb()
  res.json({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    users: db.users.length,
    tickets: db.tickets.length,
  })
})

app.use('/api/auth', authRoutes)
app.use('/api', catalogRoutes)

// 404 en JSON (no HTML) para que el cliente siempre pueda parsear la respuesta
app.use((req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
})

// Manejador de errores
app.use((error, _req, res, _next) => {
  console.error('[api] error:', error)
  res.status(500).json({ message: 'Error interno del servidor.' })
})

app.listen(PORT, () => {
  readDb() // fuerza la creación de db.json al arrancar
  console.log('')
  console.log('  🎤  API de ARMY Pass lista')
  console.log(`  ➜  Local:   http://localhost:${PORT}/api/health`)
  console.log(`  ➜  Usuario: jeanpierre@army.pe / bts2026`)
  console.log('')
})
