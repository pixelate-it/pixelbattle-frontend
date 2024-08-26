import { useEffect, useState } from 'preact/hooks'
import { Store } from 'unistore'

export function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }

  return true
}

export const useStore = <T extends object>(store: Store<T>): T => {
  const [state, setState] = useState<T>(store.getState)

  useEffect(() => {
    let oldState = state
    const sub = (newState: T) => {
      if (!arraysEqual(Object.values(oldState), Object.values(newState)))
        setState(newState)
      oldState = newState
    }

    store.subscribe(sub)

    return () => {
      store.unsubscribe(sub)
    }
  }, [])

  return state
}
