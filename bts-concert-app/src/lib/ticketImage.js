/**
 * Genera un PNG descargable de la entrada a partir del <canvas> del QR.
 * Todo se dibuja en cliente con la Canvas API: no hace falta backend ni
 * librerías de PDF.
 */

import { formatLongDate, formatTime } from './format.js'

const WIDTH = 1080
const HEIGHT = 1920

export function downloadTicketImage({ ticket, event, qrCanvas, user }) {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Tu navegador no soporta la descarga de la entrada.')

  /* ---------------------------- Fondo ---------------------------- */
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  bg.addColorStop(0, '#2a0d5a')
  bg.addColorStop(0.5, '#742ee8')
  bg.addColorStop(1, '#d61f8f')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // Halos decorativos
  drawGlow(ctx, 180, 260, 320, 'rgba(255,255,255,0.18)')
  drawGlow(ctx, 920, 1500, 380, 'rgba(255,122,198,0.25)')

  /* --------------------------- Cabecera --------------------------- */
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,0.72)'
  ctx.font = '600 34px Outfit, Inter, sans-serif'
  ctx.fillText('ENTRADA DIGITAL OFICIAL', WIDTH / 2, 150)

  ctx.fillStyle = '#ffffff'
  ctx.font = '800 76px Outfit, Inter, sans-serif'
  ctx.fillText(event.tour.toUpperCase(), WIDTH / 2, 250)

  ctx.font = '600 44px Outfit, Inter, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.88)'
  ctx.fillText(event.city.toUpperCase(), WIDTH / 2, 316)

  /* ------------------------ Tarjeta blanca ------------------------ */
  const cardX = 70
  const cardY = 370
  const cardW = WIDTH - cardX * 2
  const cardH = 1330 // termina en y = 1700, dejando sitio al pie

  ctx.fillStyle = '#ffffff'
  roundRect(ctx, cardX, cardY, cardW, cardH, 56)
  ctx.fill()

  /* ---------------------------- QR ---------------------------- */
  const qrSize = 420
  const qrX = (WIDTH - qrSize) / 2
  const qrY = cardY + 70

  ctx.fillStyle = '#f6f2ff'
  roundRect(ctx, qrX - 26, qrY - 26, qrSize + 52, qrSize + 52, 36)
  ctx.fill()

  if (qrCanvas) {
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize)
    ctx.imageSmoothingEnabled = true
  }

  ctx.fillStyle = '#631fcc'
  ctx.font = '700 30px Inter, sans-serif'
  ctx.fillText(ticket.id, WIDTH / 2, qrY + qrSize + 78)

  /* ------------------------ Línea perforada ------------------------ */
  const dashY = qrY + qrSize + 122
  ctx.strokeStyle = '#dacdff'
  ctx.lineWidth = 4
  ctx.setLineDash([16, 16])
  ctx.beginPath()
  ctx.moveTo(cardX + 60, dashY)
  ctx.lineTo(cardX + cardW - 60, dashY)
  ctx.stroke()
  ctx.setLineDash([])

  // Muescas laterales (efecto ticket)
  ctx.fillStyle = '#742ee8'
  circle(ctx, cardX, dashY, 32)
  circle(ctx, cardX + cardW, dashY, 32)

  /* --------------------------- Detalles --------------------------- */
  const rows = [
    ['TITULAR', ticket.holderName || user?.fullName || '—'],
    ['ZONA', ticket.zone],
    ['PUERTA DE INGRESO', ticket.gate],
    ['SECTOR / ASIENTO', `${ticket.sector} · ${ticket.seat}`],
    ['FECHA', formatLongDate(event.dateISO)],
    ['HORA', `Puertas ${formatTime(event.doorsOpenISO)} · Show ${formatTime(event.dateISO)}`],
    ['RECINTO', `${event.venue} — ${event.venueAddress}`],
    ['ESTADO', ticket.status],
  ]

  const rowGap = 82
  const rowsTop = dashY + 68
  const textX = cardX + 64
  const maxTextWidth = cardW - 128

  ctx.textAlign = 'left'
  rows.forEach(([label, value], index) => {
    const y = rowsTop + index * rowGap

    ctx.fillStyle = '#8b7aa8'
    ctx.font = '700 22px Inter, sans-serif'
    ctx.fillText(label, textX, y)

    ctx.fillStyle = '#120c1e'
    ctx.font = '700 32px Outfit, Inter, sans-serif'
    ctx.fillText(truncate(ctx, value, maxTextWidth), textX, y + 40)
  })

  /* ----------------------------- Pie ----------------------------- */
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = '600 28px Inter, sans-serif'
  ctx.fillText('Presenta este código en la puerta indicada junto a tu DNI.', WIDTH / 2, 1772)

  ctx.fillStyle = 'rgba(255,255,255,0.62)'
  ctx.font = '500 24px Inter, sans-serif'
  ctx.fillText('ARMY Pass · Proyecto de demostración', WIDTH / 2, 1822)
  ctx.fillText(`Generado el ${new Date().toLocaleString('es-PE')}`, WIDTH / 2, 1864)

  /* --------------------------- Descarga --------------------------- */
  const link = document.createElement('a')
  link.download = `entrada-${ticket.id}.png`
  link.href = canvas.toDataURL('image/png')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/** Archivo .json que simula un pase de Wallet. */
export function downloadWalletPass({ ticket, event }) {
  const pass = {
    formatVersion: 1,
    passTypeIdentifier: 'pass.pe.armypass.demo',
    organizationName: 'ARMY Pass (demo)',
    description: `${event.tour} — ${event.city}`,
    eventTicket: {
      primaryFields: [{ key: 'event', label: 'EVENTO', value: event.title }],
      secondaryFields: [
        { key: 'venue', label: 'RECINTO', value: event.venue },
        { key: 'date', label: 'FECHA', value: event.dateISO },
      ],
      auxiliaryFields: [
        { key: 'zone', label: 'ZONA', value: ticket.zone },
        { key: 'gate', label: 'PUERTA', value: ticket.gate },
        { key: 'seat', label: 'ASIENTO', value: ticket.seat },
      ],
      backFields: [
        { key: 'order', label: 'ORDEN', value: ticket.orderId },
        { key: 'holder', label: 'TITULAR', value: ticket.holderName },
      ],
    },
    barcode: { format: 'PKBarcodeFormatQR', message: ticket.id, messageEncoding: 'iso-8859-1' },
  }

  const blob = new Blob([JSON.stringify(pass, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `wallet-${ticket.id}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/* ------------------------------ helpers ------------------------------ */

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius)
    return
  }
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}

function circle(ctx, x, y, radius) {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
}

function drawGlow(ctx, x, y, radius, color) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
  gradient.addColorStop(0, color)
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fill()
}

function truncate(ctx, text, maxWidth) {
  let value = String(text)
  if (ctx.measureText(value).width <= maxWidth) return value
  while (value.length > 3 && ctx.measureText(`${value}…`).width > maxWidth) {
    value = value.slice(0, -1)
  }
  return `${value}…`
}
