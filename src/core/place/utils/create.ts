import { BasicEvent, EventBus } from '../buses/types'
import { DependenciesCallback } from './types'

export const subEvent = <T extends object>(
  eventBus: EventBus<T>,
  callback: BasicEvent<T>,
  dependencies?: DependenciesCallback<T>
) => {
  eventBus.push((event: T) => {
    let v = dependencies === undefined
    if (dependencies) {
      const deps = dependencies(event)
      v = deps.filter((val) => val).length == deps.length
    }
    if (v) {
      const b = callback(event)
      return b !== undefined ? b : true
    }
    return false
  })
}
