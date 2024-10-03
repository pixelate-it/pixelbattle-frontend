import { DomEvents } from './domEvents'
import { PluginsEvents } from './pluginsEvents'
import { RenderEvents } from './renderEvents'

export const clearBuses = () => {
  DomEvents.clear()
  PluginsEvents.clear()
  RenderEvents.clear()
}
