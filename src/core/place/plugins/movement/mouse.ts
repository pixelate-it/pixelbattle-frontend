import { config } from 'src/config'
import { Viewport } from 'src/core/place/storage/viewport'
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

export const mousePlugin = () => {
  let mouseDown = false
  let startX = 0
  let startY = 0
  let startClientX = 0
  let startClientY = 0
  let dragged = useValerator(false, PluginsEvents.draggedEvents)

  useWheel((event) => {
    const zoom = event.deltaY < 0 ? 1.15 : 0.85
    const result = zoom * Viewport.scale
    if (result < config.zoom.min) return
    if (result > config.zoom.max) return
    Viewport.x = event.clientX - zoom * (event.clientX - Viewport.x)
    Viewport.y = event.clientY - zoom * (event.clientY - Viewport.y)
    Viewport.scale *= zoom
    Viewport.fix()
  })

  useMouseDown((event) => {
    mouseDown = true
    const { x, y } = Viewport.transformCoords(event.clientX, event.clientY)
    startX = x
    startY = y
    generateEvent(
      Viewport.transformCoordsWithFloor(event.clientX, event.clientY),
      PluginsEvents.clickStartEvents
    )
    startClientX = event.clientX
    startClientY = event.clientY
  })

  useMouseUp((event) => {
    mouseDown = false

    const { x, y } = Viewport.transformCoordsWithFloor(
      event.clientX,
      event.clientY
    )
    if (!dragged && !Viewport.locked)
      generateEvent(
        { x, y, button: event.button },
        PluginsEvents.clickEndEvents
      )
    generateEvent(
      { x, y, button: event.button },
      PluginsEvents.clickGuarantiedEndEvents
    )
    dragged = false
  })

  useMouseMove((event) => {
    if (mouseDown)
      if (!Viewport.locked) {
        const x = event.clientX - startX * Viewport.scale
        const y = event.clientY - startY * Viewport.scale
        if (
          Math.abs(startClientX - event.clientX) > 10 ||
          Math.abs(startClientY - event.clientY) > 10
        )
          dragged = true
        if (dragged) {
          Viewport.x = x
          Viewport.y = y
          Viewport.fix()
        }
      }

    const { x, y } = Viewport.transformCoordsWithFloor(
      event.clientX,
      event.clientY
    )
    generateEvent({ x, y }, PluginsEvents.pointerMoveEvents)
  })

  useMouseLeave(() => {
    mouseDown = false
  })
}
