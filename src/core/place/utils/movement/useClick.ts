import { BasicPointerEvent, PluginsEvents } from '../../buses'
import { subEvent } from '../create'
import { ClearEvent, DependenciesCallback } from '../types'

/**
 * Subscribes on click event of button | touch screen
 * @param type start or end
 * @param callback callback with event
 * @param dependencies function with array like conditions
 */
export const useClick = (
  type: 'start' | 'end',
  callback: ClearEvent<BasicPointerEvent>,
  dependencies?: DependenciesCallback<BasicPointerEvent>
) => {
  subEvent(
    type === 'start'
      ? PluginsEvents.clickStartEvents
      : PluginsEvents.clickEndEvents,
    (event) => {
      const b = callback(event)
      return b !== undefined ? b : false
    },
    dependencies
  )
}

/**
 * Guarantied end click. Cuz normally end click event can stopped if canvas dragged
 * @param callback callback with event
 * @param dependencies function with array like conditions
 */
export const useGuarantiedClick = (
  callback: ClearEvent<BasicPointerEvent>,
  dependencies?: DependenciesCallback<BasicPointerEvent>
) => {
  subEvent(
    PluginsEvents.clickGuarantiedEndEvents,
    (event) => {
      const b = callback(event)
      return b !== undefined ? b : false
    },
    dependencies
  )
}
