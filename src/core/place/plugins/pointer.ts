import { PointerDaemon } from 'src/core/daemons/pointer'
import { useMove } from '../utils/movement/useMove'
import { useClick } from '../utils/movement/useClick'
import { PaletteDaemon } from 'src/core/daemons/palette'
import { useRender } from '../utils/render/primitive'
import { ApiPlace } from '../api'
import { Viewport, CanvasStorage } from 'src/core/storage'

export const pointerPlugin = () => {
  useMove(({ x, y }) => {
    let [cX, cY] = PointerDaemon.state.coordinates
    if (!Viewport.checkPointInside(x, y)) {
      PointerDaemon.setVisible(false)
      return false
    } else {
      PointerDaemon.setVisible(true)
    }
    if (cX !== x || cY !== y) PointerDaemon.setCoordinates([x, y])
    return false
  })

  useClick('end', ({ x, y, button }) => {
    if (button && button === 2) {
      const color = CanvasStorage.getPixel(x, y)
      if (color) PaletteDaemon.addAndSelect(color)
      return true
    }
    ApiPlace.putPixel(x, y)
  })

  useRender(({ graphics }) => {
    const palette = PaletteDaemon.state
    const pointer = PointerDaemon.state

    if (pointer.visible) {
      graphics.drawRect(
        pointer.coordinates[0] - 0.15,
        pointer.coordinates[1] - 0.15,
        1.3,
        1.3,
        palette.selected.getReadableColor()
      )
      graphics.drawRect(
        pointer.coordinates[0] - 0.1,
        pointer.coordinates[1] - 0.1,
        1.2,
        1.2,
        palette.selected
      )
    }
  })

  // useRender(
  //   ({ ctx }) => {
  //     const color = PaletteDaemon.state.selected
  //     ctx.fillStyle = color.toHex()
  //     ctx.strokeStyle = color.getReadableColor().toHex()
  //     ctx.lineWidth = 0.15
  //     const [x, y] = PointerDaemon.state.coordinates
  //     ctx.strokeRect(x, y, 1, 1)
  //     ctx.fillRect(x, y, 1, 1)
  //   },
  //   () => {
  //     const [x, y] = PointerDaemon.state.coordinates
  //     return [Viewport.checkPointInside(x, y)]
  //   }
  // )
}
