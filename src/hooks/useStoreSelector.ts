import { useEffect, useState } from 'preact/hooks'
import { Store } from 'unistore'

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

export const useStoreSelector = <I extends object, O extends object>(
  store: Store<I>,
  properties: string[]
): O => {
  const selector = select<I, O>(properties)
  const [state, setState] = useState<O>(() => selector(store.getState()))

  useEffect(() => {
    const sub = (state: I) => {
      const selectedState = selector(state)
      // I will in future make her more smart algorithm for checking is update something
      if (!arraysEqual(Object.values(state), Object.values(selectedState)))
        setState(selectedState)
    }

    store.subscribe(sub)

    return () => {
      store.unsubscribe(sub)
    }
  }, [])

  return state
}
