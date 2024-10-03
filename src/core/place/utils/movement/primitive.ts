import { DomEvents } from '../../buses/domEvents'
import { EventBus } from '../../buses/types'
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

export const useWheel = createPrimitive(DomEvents.wheelEvents)
export const useMouseDown = createPrimitive(DomEvents.mouseDownEvents)
export const useMouseUp = createPrimitive(DomEvents.mouseUpEvents)
export const useMouseMove = createPrimitive(DomEvents.mouseMoveEvents)
export const useMouseLeave = createPrimitive(DomEvents.mouseLeaveEvents)
export const useTouchStart = createPrimitive(DomEvents.touchStartEvent)
export const useTouchEnd = createPrimitive(DomEvents.touchEndEvent)
export const useTouchCancel = createPrimitive(DomEvents.touchCancelEvent)
export const useTouchMove = createPrimitive(DomEvents.touchMoveEvent)
