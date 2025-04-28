import {
  useWheel,
  useMouseDown,
  useMouseUp,
  useMouseMove,
  useMouseLeave
} from '../../utils/movement/primitive'
import { generateEvent } from '../../utils/generators'
import { PluginsEvents } from '../../buses/pluginsEvents'
import { useValerator } from '../../utils/variables'
import { Vector } from '../../../util/vector'
import { PluginBusError } from 'src/core/util/errors'
import { Viewport } from 'src/core/storage'

export const mousePlugin = () => {
  let mouseDown = false
  let last: Vector | null
  let dragged = useValerator(false, PluginsEvents.draggedEvents)

  useWheel((event) => {
    if (Viewport.locked) return
    // Just copy of code from Pixi-viewport
    const step = (-event.deltaY * (event.deltaMode ? 20 : 1)) / 500
    const zoom = Math.pow(2, (1 + 0.25) * step)

    let result = zoom * Viewport.scale

    const oldPoint = Viewport.toLocal(event.clientX, event.clientY)

    Viewport.scale = result
    Viewport.clampZoom()
    const comparePoint = Viewport.toLocal(event.clientX, event.clientY)

    Viewport.x += comparePoint.x - oldPoint.x
    Viewport.y += comparePoint.y - oldPoint.y
  })

  useMouseDown((event) => {
    mouseDown = true
    generateEvent(
      Viewport.toLocalFloor(event.clientX, event.clientY),
      PluginsEvents.clickStartEvents,
      PluginBusError
    )
    last = new Vector(event.clientX, event.clientY)
  })

  useMouseUp((event) => {
    mouseDown = false

    const { x, y } = Viewport.toLocalFloor(event.clientX, event.clientY)
    if (!dragged && !Viewport.locked)
      generateEvent(
        { x, y, button: event.button },
        PluginsEvents.clickEndEvents,
        PluginBusError
      )
    generateEvent(
      { x, y, button: event.button },
      PluginsEvents.clickGuarantiedEndEvents,
      PluginBusError
    )
    dragged = false
  })

  useMouseMove((event) => {
    if (mouseDown && !Viewport.locked)
      if (
        dragged ||
        (last &&
          (checkThreshold(event.clientX - last.x) ||
            checkThreshold(event.clientY - last.y)))
      )
        if (!Viewport.locked) {
          Viewport.x += event.movementX / Viewport.scale
          Viewport.y += event.movementY / Viewport.scale

          dragged = true
        }

    const { x, y } = Viewport.toLocalFloor(event.clientX, event.clientY)
    generateEvent({ x, y }, PluginsEvents.pointerMoveEvents, PluginBusError)
  })

  useMouseLeave(() => {
    mouseDown = false
  })

  const checkThreshold = (change: number) => Math.abs(change) >= 10
}
