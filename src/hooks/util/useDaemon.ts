import { useEffect, useState } from 'preact/hooks'
import { Daemon } from './types'

export function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }

  return true
}

export const useDaemon = <T extends object>(store: Daemon<T>): T => {
  const [state, setState] = useState<T>(store.getState)

  useEffect(() => {
    let oldState = state
    const sub = (newState: T) => {
      if (!arraysEqual(Object.values(oldState), Object.values(newState)))
        setState(newState)
      oldState = newState
    }

    store.on(sub)

    return () => {
      store.off(sub)
    }
  }, [])

  return state
}
