import { useEffect, useState } from 'preact/hooks'
import { Daemon } from './types'

function select<I, O>(properties: string | string[]): (state: I) => O {
  if (typeof properties === 'string') properties = properties.split(/\s*,\s*/)

  return (state: I): O => {
    const selected: Record<string, unknown> = {}
    for (let i = 0; i < properties.length; i++) {
      selected[properties[i]] = state[properties[i] as keyof I]
    }
    return selected as O
  }
}

function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }

  return true
}

export const useDaemonSelector = <I extends object, O extends object>(
  store: Daemon<I>,
  properties: string[]
): O => {
  const selector = select<I, O>(properties)
  const [state, setState] = useState<O>(() => selector(store.state))

  useEffect(() => {
    let oldState = state

    const sub = (state: I) => {
      const selectedState = selector(state)
      if (!arraysEqual(Object.values(oldState), Object.values(selectedState)))
        setState(selectedState)
      oldState = selectedState
    }

    store.on(sub)

    return () => {
      store.off(sub)
    }
  }, [])

  return state
}
