import { GuiDaemon } from 'src/core/daemons/gui'
import {
  useMouseDown,
  useMouseUp,
  useMouseMove
} from '../utils/movement/primitive'
import { useLoaded, useRender } from '../utils/render/primitive'
import { guiContainers } from 'src/core/constants/gui'
import { Viewport } from 'src/core/storage'

export const guiPlugin = () => {
  let mouseDowned = false

  useMouseDown(({ clientX, clientY }) => {
    if (GuiDaemon.state.current !== null) {
      const container = GuiDaemon.state.containers[GuiDaemon.state.current]
      const pointer = Viewport.toLocal(clientX, clientY)
      if (container.isPointerInside(pointer)) {
        if (container.handlePointerDown(pointer)) Viewport.locked = true
      }
      mouseDowned = true
    }
  })

  useMouseUp(({ clientX, clientY }) => {
    if (GuiDaemon.state.current !== null) {
      const container = GuiDaemon.state.containers[GuiDaemon.state.current]
      const pointer = Viewport.toLocal(clientX, clientY)
      if (container.isPointerInside(pointer)) {
        container.handlePointerUp(pointer)
      }
    }
    Viewport.locked = false
    mouseDowned = false
  })

  useMouseMove(({ clientX, clientY }) => {
    const container = GuiDaemon.container
    if (container) {
      const pointer = Viewport.toLocal(clientX, clientY)
      if (container?.isPointerInside(pointer)) {
        let e = container.getElementAt(pointer)
        if (e) {
          let [i, element] = e
          element.hover = true
          if (mouseDowned) element.pressed = true
          GuiDaemon.updateElement(i, element)
        }
      } else {
        GuiDaemon.unPressElements()
      }
    }
  })

  useLoaded(() => {
    GuiDaemon.addContainers(...guiContainers())
    GuiDaemon.setCurrent(0)
  })

  useRender(({ graphics }) => {
    const container = GuiDaemon.container
    if (container) container.render(graphics)
  })
}
