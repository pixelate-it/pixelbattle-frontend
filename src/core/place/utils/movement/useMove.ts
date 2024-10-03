import { PluginsEvents } from '../../buses/pluginsEvents'
import { BasicPointerEvent } from '../../buses/types'
import { subEvent } from '../create'
import { ClearEvent, DependenciesCallback } from '../types'

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
