import { useEffect, useState } from 'preact/hooks'
import { Daemon } from './types'

export type ComputedActions<T> = Record<string, (v: NonNullable<T>) => unknown>
export type ComputedValues<S, T extends ComputedActions<S>> = {
  [K in keyof T]: ReturnType<T[K]>
}

export const useDaemonComputed = <T, A extends ComputedActions<T>>(
  store: Daemon<T>,
  computedActions: A
): [T, ComputedValues<T, A>] => {
  const actionsKeys = Object.keys(computedActions)

  const updateComputedValue = (state: T): ComputedValues<T, A> => {
    const result = {} as Record<keyof A, unknown>
    for (const i in actionsKeys) {
      const actionName = actionsKeys[i]
      result[actionName as keyof A] = computedActions[actionName](state!)
    }
    return result as ComputedValues<T, A>
  }

  const [state, setState] = useState<T>(store.getState)
  const [computedValues, setComputedValues] = useState<ComputedValues<T, A>>(
    () => updateComputedValue(store.getState())
  )

  useEffect(() => {
    const sub = (state: T) => {
      setState(state)
      setComputedValues(updateComputedValue(state!))
    }

    store.on(sub)

    return () => {
      store.off(sub)
    }
  }, [])

  return [state, computedValues]
}
