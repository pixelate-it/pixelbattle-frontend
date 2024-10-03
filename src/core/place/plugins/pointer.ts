import { PointerDaemon } from 'src/core/daemons/pointer'
import { useMove } from '../utils/movement/useMove'
import { useClick } from '../utils/movement/useClick'
import { PaletteDaemon } from 'src/core/daemons/palette'
import { OverlaysDaemon } from 'src/core/daemons/overlays'
import { checkPointInsideOverlays } from './overlays'
import { ToolsDaemon } from 'src/core/daemons/tools'
import { useRender } from '../utils/render/premitive'
import { ApiPlace } from '../api'
import { CanvasStorage } from '../storage/canvas'
import { Viewport } from '../storage/viewport'

export const pointerPlugin = () => {
  useMove(({ x, y }) => {
    const [cX, cY] = PointerDaemon.state.coordinates
    if (!Viewport.checkPointInside(x, y)) return false
    if (cX !== x || cY !== y) PointerDaemon.setCoordinates([x, y])
    return false
  })

  useClick(
    'end',
    ({ x, y, button }) => {
      if (button && button === 2) {
        const color = CanvasStorage.getPixel(x, y)
        if (color) PaletteDaemon.addAndSelect(color)
        return true
      }
      ApiPlace.putPixel(x, y)
    },
    ({ x, y }) => [
      OverlaysDaemon.image !== undefined,
      !checkPointInsideOverlays(x, y),
      !ToolsDaemon.state.pickerIsEnabled
    ]
  )

  useRender(
    ({ ctx }) => {
      const color = PaletteDaemon.state.selected
      ctx.fillStyle = color.toHex()
      ctx.strokeStyle = color.getReadableColor().toHex()
      ctx.lineWidth = 0.15
      const [x, y] = PointerDaemon.state.coordinates
      ctx.strokeRect(x, y, 1, 1)
      ctx.fillRect(x, y, 1, 1)
    },
    () => {
      const [x, y] = PointerDaemon.state.coordinates
      return [Viewport.checkPointInside(x, y)]
    }
  )
}
