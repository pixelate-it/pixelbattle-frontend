import { PluginsEvents } from '../../buses/pluginsEvents'
import { subEvent } from '../create'
import { ClearEvent } from '../types'

/**
 * If canvas is dragged this event will start
 * @param callback event accept callback
 * @returns
 */
export const useDragged = (callback: ClearEvent<{ current: boolean }>) =>
  subEvent(PluginsEvents.draggedEvents, (event) => {
    const b = callback(event)
    return b !== undefined ? b : false
  })
