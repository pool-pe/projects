import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Genera un token de un solo uso que se renueva cada `intervalSeconds`,
 * igual que los QR dinámicos de Ticketmaster / Teleticket.
 *
 * Devuelve el payload que se codifica en el QR y los segundos restantes
 * para poder dibujar la barra de expiración.
 */
export function useRotatingToken(ticketId, intervalSeconds = 30) {
  const [nonce, setNonce] = useState(() => randomNonce())
  const [issuedAt, setIssuedAt] = useState(() => Date.now())
  const [secondsLeft, setSecondsLeft] = useState(intervalSeconds)
  const intervalRef = useRef(intervalSeconds)

  intervalRef.current = intervalSeconds

  const rotate = useCallback(() => {
    setNonce(randomNonce())
    setIssuedAt(Date.now())
    setSecondsLeft(intervalRef.current)
  }, [])

  useEffect(() => {
    rotate()
  }, [ticketId, rotate])

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setNonce(randomNonce())
          setIssuedAt(Date.now())
          return intervalRef.current
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Payload que leería el escáner de la puerta.
  const payload = JSON.stringify({
    v: 1,
    tid: ticketId,
    nonce,
    ts: Math.floor(issuedAt / 1000),
  })

  return {
    payload,
    nonce,
    issuedAt,
    secondsLeft,
    progress: secondsLeft / intervalSeconds,
    rotate,
  }
}

function randomNonce() {
  const bytes = new Uint8Array(6)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256)
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

export default useRotatingToken
