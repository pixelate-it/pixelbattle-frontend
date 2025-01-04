import { PaletteDaemon } from 'src/core/daemons/palette'
import { useClick } from '../utils/movement/useClick'
import { ToolsDaemon } from 'src/core/daemons/tools'
import { CanvasStorage } from '../storage/canvas'
import { Viewport } from '../storage/viewport'

export const pickerPlugin = () => {
  const pickHandler = (x: number, y: number) => {
    if (!Viewport.checkPointInside(x, y)) return false
    const color = CanvasStorage.getPixel(x, y)
    if (color) PaletteDaemon.addAndSelect(color)
  }

  useClick(
    'end',
    ({ x, y }) => {
      ToolsDaemon.togglePicker()
      return pickHandler(x, y)
    },
    () => [ToolsDaemon.state.pickerIsEnabled]
  )
}
