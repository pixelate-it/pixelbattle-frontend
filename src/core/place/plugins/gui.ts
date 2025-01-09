import { Viewport } from '../storage/viewport'
import GuiButton from '../utils/gui/button'
import {
  useMouseDown,
  useMouseUp,
  useMouseMove
} from '../utils/movement/primitive'
import { useLoaded, useRender } from '../utils/render/premitive'

export const guiPlugin = () => {
  let button: GuiButton | null
  let mouseDowned = false

  useMouseDown(({ clientX, clientY }) => {
    const pointer = Viewport.toLocal(clientX, clientY)
    if (button?.isPointerInside(pointer)) {
      button.handlePointerDown()
      Viewport.locked = true
    }
    mouseDowned = true
  })

  useMouseUp(({ clientX, clientY }) => {
    const pointer = Viewport.toLocal(clientX, clientY)
    if (button?.isPointerInside(pointer)) {
      button.handlePointerUp()
    }
    Viewport.locked = false
    mouseDowned = false
  })

  useMouseMove(({ clientX, clientY }) => {
    const pointer = Viewport.toLocal(clientX, clientY)
    if (button?.isPointerInside(pointer)) {
      button.hover = true
      if (mouseDowned) button.pressed = true
    } else if (button?.pressed) {
      button.pressed = false
    }
  })

  useLoaded(({ placeWidth }) => {
    button = new GuiButton(placeWidth + 20, 0, 30, 10, () => {
      console.log("I'm alive!")
    })
  })

  useRender(({ graphics }) => {
    if (button) button.render(graphics)
  })
}
