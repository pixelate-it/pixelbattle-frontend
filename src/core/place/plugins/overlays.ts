import { OverlaysDaemon } from 'src/core/daemons/overlays'
import { PaletteDaemon } from 'src/core/daemons/palette'
import { ApiPlace } from '../api'
import { useClick, useGuarantiedClick } from '../utils/movement/useClick'
import { Overlay } from 'src/core/classes/primitives/Overlay'
import { ToolsDaemon } from 'src/core/daemons/tools'
import { useRender } from '../utils/render/premitive'
import { usePress } from '../utils/movement/usePress'
import { Viewport } from '../storage/viewport'
import { useMove } from '../utils/movement/useMove'

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

  // usePress(
  //   () => {
  //     OverlaysDaemon.setOverlayEditingMode(true)
  //   },
  //   100,
  //   ({ x, y }) => [
  //     !OverlaysDaemon.state.editingMode,
  //     !OverlaysDaemon.empty,
  //     checkPointInsideOverlays(x, y)
  //   ]
  // )

  // let overlayIsDragging = false
  // let startX = 0
  // let startY = 0
  // let overlayStartX = 0
  // let overlayStartY = 0

  // useClick(
  //   'start',
  //   ({ x, y, button }) => {
  //     if (button === 2) OverlaysDaemon.setOverlayEditingMode(false)
  //     overlayIsDragging = true
  //     startX = x
  //     startY = y
  //     overlayStartX = OverlaysDaemon.currentOverlay.x
  //     overlayStartY = OverlaysDaemon.currentOverlay.y
  //     Viewport.locked = true
  //   },
  //   ({ x, y }) => [
  //     OverlaysDaemon.state.editingMode,
  //     !OverlaysDaemon.empty,
  //     checkPointInsideOverlays(x, y)
  //   ]
  // )
  // useGuarantiedClick(
  //   () => {
  //     overlayIsDragging = false
  //     Viewport.locked = false
  //   },
  //   () => [OverlaysDaemon.state.editingMode, !OverlaysDaemon.empty]
  // )

  // useMove(
  //   ({ x, y }) => {
  //     OverlaysDaemon.setOverlayPosition(
  //       x - startX + overlayStartX,
  //       y - startY + overlayStartY
  //     )
  //   },
  //   ({ x, y }) => [
  //     OverlaysDaemon.state.editingMode,
  //     !OverlaysDaemon.empty,
  //     overlayIsDragging,
  //     checkPointInsideOverlays(x, y)
  //   ]
  // )

  // useClick(
  //   'end',
  //   ({ button }) => {
  //     if (button === 2) OverlaysDaemon.setOverlayEditingMode(false)
  //   },
  //   () => [OverlaysDaemon.state.editingMode]
  // )
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

export const checkPointInsideOverlays = (x: number, y: number): boolean => {
  if (OverlaysDaemon.state.viewMode === 0)
    return OverlaysDaemon.currentOverlay!.checkPointInside(x, y)
  else if (OverlaysDaemon.state.viewMode === 1)
    for (let i = 0; i < OverlaysDaemon.state.overlays.length; i++)
      if (
        OverlaysDaemon.state.overlays[i].checkPointInside(x, y) &&
        OverlaysDaemon.state.overlays[i].getPixel(x, y)?.color[3] !== 0
      )
        return true
  return false
}
