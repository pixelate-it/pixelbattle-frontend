import { PluginsEvents } from '../../buses/pluginsEvents'
import { BasicPointerEvent } from '../../buses/types'
import { subEvent } from '../create'
import { ClearEvent, DependenciesCallback } from '../types'

/**
 * Subs on moving pointer, or touch event
 * @param callback event accepter callback
 * @param dependencies function with array like conditions
 * @returns
 */
export const useMove = (
  callback: ClearEvent<BasicPointerEvent>,
  dependencies?: DependenciesCallback<BasicPointerEvent>
) =>
  subEvent(
    PluginsEvents.pointerMoveEvents,
    (event) => {
      const b = callback(event)
      return b !== undefined ? b : false
    },
    dependencies
  )
