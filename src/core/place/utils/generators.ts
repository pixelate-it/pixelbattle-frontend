import { GeneralDaemon } from 'src/core/daemons/general'
import { EventBus } from '../buses/types'

export const generateEvent = <T extends object>(
  event: T,
  eventBus: EventBus<T>,
  error?: new (msg?: string) => Error
) => {
  try {
    for (const i in eventBus) if (eventBus[i](event)) return
  } catch (e: unknown) {
    if (error) GeneralDaemon.setError(new error(e as string))
  }
}
