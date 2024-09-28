import { useEffect, useRef, useState } from 'preact/hooks'

export const useBuffer = <T>(value: T, delay: number = 100): T => {
  const [deferredValue, setDeferredValue] = useState<T>(value)
  const timerRef = useRef<number | NodeJS.Timeout>(null)

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      setDeferredValue(value)
      timerRef.current = null
    }, delay)

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [value, delay])

  return deferredValue
}
