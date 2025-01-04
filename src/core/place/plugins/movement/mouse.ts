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

    const mouseX = event.clientX
    const mouseY = event.clientY

    const worldXBeforeZoom = Viewport.x - mouseX / Viewport.scale
    const worldYBeforeZoom = Viewport.y - mouseY / Viewport.scale

    Viewport.scale = result

    const worldXAfterZoom = Viewport.x - mouseX / Viewport.scale
    const worldYAfterZoom = Viewport.y - mouseY / Viewport.scale

    Viewport.x += worldXBeforeZoom - worldXAfterZoom
    Viewport.y += worldYBeforeZoom - worldYAfterZoom
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
        const deltaX = event.movementX
        const deltaY = event.movementY

        Viewport.x += deltaX / Viewport.scale
        Viewport.y += deltaY / Viewport.scale

        if (
          Math.abs(startClientX - event.clientX) > 20 ||
          Math.abs(startClientY - event.clientY) > 20
        )
          dragged = true
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
