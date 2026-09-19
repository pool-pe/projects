/**
 * Genera server/seed.json a partir de src/data/mockDb.js.
 *
 * Así el backend y el modo demo del frontend nunca se desincronizan:
 * la fuente de verdad de los datos ficticios es un único archivo.
 *
 * Uso: npm run seed:build   (y luego `npm run seed` para regenerar db.json)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  CONCERT_GUIDE,
  DEMO_USER,
  FEATURED_EVENT,
  NOTIFICATIONS,
  PURCHASES,
  TICKETS,
} from '../src/data/mockDb.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const seed = {
  featuredEventId: FEATURED_EVENT.id,
  users: [DEMO_USER],
  sessions: [],
  events: [FEATURED_EVENT],
  tickets: TICKETS,
  purchases: PURCHASES.map((purchase) => ({ ...purchase, userId: DEMO_USER.id })),
  guide: CONCERT_GUIDE,
  notifications: NOTIFICATIONS,
}

const target = path.join(__dirname, 'seed.json')
fs.writeFileSync(target, `${JSON.stringify(seed, null, 2)}\n`, 'utf8')

console.log('✅  server/seed.json regenerado desde src/data/mockDb.js')
console.log(`    Evento:   ${FEATURED_EVENT.title} — ${FEATURED_EVENT.venue}`)
console.log(`    Entradas: ${TICKETS.length}`)
console.log(`    Compras:  ${PURCHASES.length}`)
