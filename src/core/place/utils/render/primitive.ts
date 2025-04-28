import { RenderEvents } from '../../buses'
import { EventBus } from '../../buses'
import { subEvent } from '../create'
import { ClearEvent, DependenciesCallback } from '../types'

const createPrimitive =
  <T extends object>(eventBus: EventBus<T>) =>
  (callback: ClearEvent<T>, dependencies?: DependenciesCallback<T>) =>
    subEvent(
      eventBus,
      (event: T) => {
        callback(event)
        return false
      },
      dependencies
    )

export const useRender = createPrimitive(RenderEvents.renderEvent)
export const useLoaded = createPrimitive(RenderEvents.loadedEvent)
export const usePostRender = createPrimitive(RenderEvents.postRenderEvent)
