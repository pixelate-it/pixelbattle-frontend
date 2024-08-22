import { useEffect, useState } from 'preact/hooks'
import { Store } from 'unistore'

export const useStore = <T>(store: Store<T>): T => {
  const [state, setState] = useState<T>(store.getState)

  useEffect(() => {
    const sub = (state: T) => {
      setState(state)
    }

    store.subscribe(sub)

    return () => {
      store.unsubscribe(sub)
    }
  }, [])

  return state
}
