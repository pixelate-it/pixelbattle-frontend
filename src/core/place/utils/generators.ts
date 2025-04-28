import { EventBus } from '../buses'
import { ErrorDaemon } from 'src/core/daemons/error'

export const generateEvent = <T extends object>(
  event: T,
  eventBus: EventBus<T>,
  error?: new (msg?: string) => Error
) => {
  try {
    for (const i in eventBus) if (eventBus[i](event)) return
  } catch (e: unknown) {
    if (error) ErrorDaemon.setError(new error(e as string))
  }
}
