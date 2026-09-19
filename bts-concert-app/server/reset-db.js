/** Regenera server/db.json desde server/seed.json. Uso: `npm run seed` */

import { resetDb } from './db.js'

const db = resetDb()

console.log('✅  Base de datos regenerada desde seed.json')
console.log(`    Usuarios: ${db.users.length}`)
console.log(`    Entradas: ${db.tickets.length}`)
console.log(`    Compras:  ${db.purchases.length}`)
console.log('    Acceso demo: jeanpierre@army.pe / bts2026')
