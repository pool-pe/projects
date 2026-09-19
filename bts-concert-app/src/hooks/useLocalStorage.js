import { useCallback, useEffect, useState } from 'react'

/**
 * useState persistido en localStorage.
 * Tolera modo incógnito / almacenamiento bloqueado sin romper la app
 * y se sincroniza entre pestañas mediante el evento `storage`.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  const set = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next
        try {
          if (resolved === null || resolved === undefined) {
            window.localStorage.removeItem(key)
          } else {
            window.localStorage.setItem(key, JSON.stringify(resolved))
          }
        } catch {
          /* almacenamiento no disponible: el estado vive solo en memoria */
        }
        return resolved
      })
    },
    [key],
  )

  useEffect(() => {
    function onStorage(event) {
      if (event.key !== key) return
      try {
        setValue(event.newValue ? JSON.parse(event.newValue) : initialValue)
      } catch {
        /* valor corrupto: lo ignoramos */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
    // `initialValue` se usa solo como respaldo; no queremos re-suscribirnos por él.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [value, set]
}

export default useLocalStorage
