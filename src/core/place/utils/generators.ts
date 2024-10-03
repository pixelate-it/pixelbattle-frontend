import { EventBus } from '../buses/types'

export const generateEvent = <T extends object>(
  event: T,
  eventBus: EventBus<T>
) => {
  for (const i in eventBus) if (eventBus[i](event)) return
}
