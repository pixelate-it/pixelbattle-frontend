import { OverlaysDaemon } from 'src/core/daemons/overlays'
import { PaletteDaemon } from 'src/core/daemons/palette'
import { useClick } from '../utils/movement/useClick'
import { ToolsDaemon } from 'src/core/daemons/tools'
import { useRender } from '../utils/render/primitive'
import { usePress } from '../utils/movement/usePress'
import { GuiDaemon } from 'src/core/daemons/gui'
import { Overlay } from 'src/core/util/overlay'

export const overlaysPlugin = () => {
  overlaysMovementPlugin()
  overlaysRenderPlugin()
}

const overlaysMovementPlugin = () => {
  const processForImage = (x: number, y: number, image: Overlay) => {
    if (image.checkPointInside(x, y)) {
      const color = image.getPixel(x, y)
      if (color && color.color[3] !== 0) {
        PaletteDaemon.addAndSelect(color)
        return true
      }
    }
    return false
  }

  const overlayPickHandler = (x: number, y: number) => {
    if (OverlaysDaemon.state.viewMode === 0)
      return processForImage(x, y, OverlaysDaemon.currentOverlay)
    else if (OverlaysDaemon.state.viewMode === 1)
      for (let i = 0; i < OverlaysDaemon.state.overlays.length; i++)
        if (processForImage(x, y, OverlaysDaemon.state.overlays[i])) return true
  }

  usePress(
    () => {
      GuiDaemon.setCurrent(0)
    },
    1000,
    ({ x, y }) => [
      !OverlaysDaemon.empty,
      checkPointInsideOverlays(x, y),
      !OverlaysDaemon.state.gui
    ]
  )

  // usePressMove(
  //   ({ x, y }) => {
  //     const currentOverlay = OverlaysDaemon.currentOverlay
  //     startPoint.x = x - currentOverlay.x
  //     startPoint.y = y - currentOverlay.y
  //   },
  //   ({ x, y }) => {
  //     OverlaysDaemon.setOverlayPosition(x - startPoint.x, y - startPoint.y)
  //   },
  //   () => {},
  //   ({ x, y }) => [checkPointInsideSelected(x, y)]
  // )

  useClick(
    'end',
    ({ x, y }) => {
      ToolsDaemon.togglePicker()
      return overlayPickHandler(x, y)
    },
    ({ x, y }) => [
      ToolsDaemon.state.pickerIsEnabled,
      !OverlaysDaemon.empty,
      checkPointInsideOverlays(x, y)
    ]
  )

  useClick(
    'end',
    ({ x, y, button }) => {
      if (button && button === 2) {
        return overlayPickHandler(x, y)
      }
      return false
    },
    ({ x, y }) => [!OverlaysDaemon.empty, checkPointInsideOverlays(x, y)]
  )
}

const overlaysRenderPlugin = () => {
  useRender(
    ({ graphics }) => {
      const state = OverlaysDaemon.state
      if (state.viewMode === 1) {
        for (let i = 0; i < state.overlays.length; i++) {
          const image = state.overlays[i]
          if (image.raw) {
            graphics.drawImage(image.x, image.y, image.raw, image.opacity / 100)
          }
        }
      } else if (state.viewMode === 0 && OverlaysDaemon.currentOverlay) {
        const image = OverlaysDaemon.currentOverlay
        if (image.raw) {
          graphics.drawImage(
            image.x,
            image.y,
            OverlaysDaemon.currentOverlay.raw!,
            image.opacity / 100
          )
        }
      }
    },
    () => [!OverlaysDaemon.empty]
  )
}

const checkPointInsideOverlays = (x: number, y: number): boolean => {
  if (OverlaysDaemon.state.viewMode === 0 && OverlaysDaemon.currentOverlay)
    return OverlaysDaemon.currentOverlay.checkPointInside(x, y)
  else if (OverlaysDaemon.state.viewMode === 1)
    for (let i = 0; i < OverlaysDaemon.state.overlays.length; i++)
      if (
        OverlaysDaemon.state.overlays[i].checkPointInside(x, y) &&
        OverlaysDaemon.state.overlays[i].getPixel(x, y)?.color[3] !== 0
      )
        return true
  return false
}

// const checkPointInsideSelected = (x: number, y: number): boolean => {
//   if (
//     !OverlaysDaemon.guiEnabled ||
//     !OverlaysDaemon.empty ||
//     !OverlaysDaemon.currentOverlay
//   )
//     return false
//   return OverlaysDaemon.currentOverlay.checkPointInside(x, y)
// }
