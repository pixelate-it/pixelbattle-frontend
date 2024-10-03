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

export const mousePlugin = (canDrag: boolean) => {
  let mouseDown = false
  let dragged = false
  let startX = 0
  let startY = 0
  let startClientX = 0
  let startClientY = 0

  useWheel((event) => {
    const zoom = event.deltaY < 0 ? 1.15 : 0.85
    const result = zoom * Viewport.scale
    if (result < config.zoom.min) return
    if (result > config.zoom.max) return
    Viewport.x = event.clientX - zoom * (event.clientX - Viewport.x)
    Viewport.y = event.clientY - zoom * (event.clientY - Viewport.y)
    Viewport.scale *= zoom
  })

  useMouseDown((event) => {
    mouseDown = true
    const { x, y } = Viewport.transformCoords(event.clientX, event.clientY)
    startX = x
    startY = y
    startClientX = event.clientX
    startClientY = event.clientY
    generateEvent(
      Viewport.transformCoordsWithFloor(event.clientX, event.clientY),
      PluginsEvents.clickStartEvents
    )
  })

  useMouseUp((event) => {
    mouseDown = false

    const { x, y } = Viewport.transformCoordsWithFloor(
      event.clientX,
      event.clientY
    )
    if (!dragged)
      generateEvent(
        { x, y, button: event.button },
        PluginsEvents.clickEndEvents
      )
    dragged = false
  })

  useMouseMove((event) => {
    if (mouseDown)
      if (canDrag) {
        const x = event.clientX - startX * Viewport.scale
        const y = event.clientY - startY * Viewport.scale
        const { x: oldX, y: oldY } = Viewport
        if (startClientX - oldX > 10 || startClientY - oldY > 10) dragged = true
        if (dragged) {
          Viewport.x = x
          Viewport.y = y
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
