import createStore, { Store } from 'unistore'

export type ComputedActions<T> = Record<string, (v: NonNullable<T>) => unknown>
export type ComputedValues<S, T extends ComputedActions<S>> = {
  [K in keyof T]: ReturnType<T[K]>
}

export const createComputedStore = <T, A extends ComputedActions<T>>(
  store: Store<T>,
  computedActions: A
): Store<ComputedValues<T, A>> => {
  const actionsKeys = Object.keys(computedActions)

  const getComputedValues = (state: T) => {
    const result = {} as Record<keyof A, unknown>
    for (const i in actionsKeys) {
      const actionName = actionsKeys[i]
      result[actionName as keyof A] = computedActions[actionName](state!)
    }
    return result as ComputedValues<T, A>
  }

  const computedStore = createStore<ComputedValues<T, A>>(
    getComputedValues(store.getState())
  )

  store.subscribe((v) => {
    computedStore.setState(getComputedValues(v))
  })

  return computedStore
}
