import { useEffect, useRef, useState } from 'preact/hooks'

export const useDecorativeNumber = (
  value: number,
  delay: number = 50
): string => {
  const [deferredValue, setDeferredValue] = useState<string>(value + '')
  const timerRef = useRef<number | NodeJS.Timeout>(null)

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
    }

    const numbersInValue = (value + '').split('')
    const numbersInDeferredValue = (deferredValue + '').split('')

    if (numbersInValue[0] !== numbersInDeferredValue[0]) {
      const newVal =
        numbersInValue[0] +
        numbersInValue
          .splice(1)
          .map(() => 'x')
          .join('')
      if (newVal !== deferredValue) setDeferredValue(newVal)
    }

    timerRef.current = setTimeout(() => {
      setDeferredValue(value + '')
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
