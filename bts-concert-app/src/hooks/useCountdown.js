import { useEffect, useState } from 'react'

function calculate(targetIso) {
  const target = new Date(targetIso).getTime()
  const diff = target - Date.now()

  if (Number.isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isPast: true, invalid: true }
  }

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isPast: true, invalid: false }
  }

  const seconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    total: diff,
    isPast: false,
    invalid: false,
  }
}

/**
 * Cuenta regresiva hasta una fecha ISO.
 * Se apoya en Date.now() en cada tick, así que no se desfasa aunque el
 * navegador congele el intervalo al pasar a segundo plano.
 */
export function useCountdown(targetIso) {
  const [timeLeft, setTimeLeft] = useState(() => calculate(targetIso))

  useEffect(() => {
    setTimeLeft(calculate(targetIso))

    const id = setInterval(() => {
      const next = calculate(targetIso)
      setTimeLeft(next)
      if (next.isPast) clearInterval(id)
    }, 1000)

    // Al volver de segundo plano, recalculamos de inmediato.
    const onVisible = () => {
      if (document.visibilityState === 'visible') setTimeLeft(calculate(targetIso))
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [targetIso])

  return timeLeft
}

export default useCountdown
