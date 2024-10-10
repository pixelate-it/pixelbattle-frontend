import { EventBus } from '../buses/types'
import { generateEvent } from './generators'

export const useValerator = <T>(val: T, bus: EventBus<{ current: T }>) => {
  let current = val
  const reinforced = {
    get current() {
      return current
    },
    set current(val: T) {
      current = val

      generateEvent({ current: val }, bus)
    }
  }
  return reinforced.current
}
