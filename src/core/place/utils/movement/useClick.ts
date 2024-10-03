import { PluginsEvents } from '../../buses/pluginsEvents'
import { BasicPointerEvent } from '../../buses/types'
import { subEvent } from '../create'
import { ClearEvent, DependenciesCallback } from '../types'

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
