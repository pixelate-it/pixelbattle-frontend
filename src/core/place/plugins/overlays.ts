import { OverlaysDaemon } from 'src/core/daemons/overlays'
import { PaletteDaemon } from 'src/core/daemons/palette'
import { ApiPlace } from '../api'
import { useClick, useGuarantiedClick } from '../utils/movement/useClick'
import { OverlayImage } from 'src/core/classes/primitives/OverlayImage'
import { ToolsDaemon } from 'src/core/daemons/tools'
import { useRender } from '../utils/render/premitive'
import { usePress } from '../utils/movement/usePress'
import { useMove } from '../utils/movement/useMove'
import { Viewport } from '../storage/viewport'

export const overlaysPlugin = () => {
  overlaysMovementPlugin()
  overlaysRenderPlugin()
}

const overlaysMovementPlugin = () => {
  const processForImage = (x: number, y: number, image: OverlayImage) => {
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
    if (OverlaysDaemon.state.mode === 0)
      return processForImage(x, y, OverlaysDaemon.image!)
    else if (OverlaysDaemon.state.mode === 1)
      for (let i = 0; i < OverlaysDaemon.state.images.length; i++)
        if (processForImage(x, y, OverlaysDaemon.state.images[i])) return true
  }

  useClick(
    'end',
    ({ x, y, button }) => {
      if (button && button === 2) {
        return overlayPickHandler(x, y)
      }
      ApiPlace.putPixel(x, y)
    },
    ({ x, y }) => [
      !ToolsDaemon.state.pickerIsEnabled,
      OverlaysDaemon.image !== undefined,
      checkPointInsideOverlays(x, y)
    ]
  )

  useClick(
    'end',
    ({ x, y }) => {
      ToolsDaemon.togglePicker()
      return overlayPickHandler(x, y)
    },
    ({ x, y }) => [
      ToolsDaemon.state.pickerIsEnabled,
      OverlaysDaemon.image !== undefined,
      checkPointInsideOverlays(x, y)
    ]
  )

  usePress(
    () => {
      OverlaysDaemon.setEditing(true)
    },
    100,
    ({ x, y }) => [
      OverlaysDaemon.image !== undefined,
      checkPointInsideOverlays(x, y)
    ]
  )

  let clickStarted = false
  let startX = 0
  let startY = 0
  let overlayStartX = 0
  let overlayStartY = 0

  useClick(
    'start',
    ({ x, y }) => {
      clickStarted = true
      startX = x
      startY = y
      overlayStartX = OverlaysDaemon.image!.x
      overlayStartY = OverlaysDaemon.image!.y
      Viewport.locked = true
    },
    ({ x, y }) => [
      OverlaysDaemon.state.editing,
      OverlaysDaemon.image !== undefined,
      checkPointInsideOverlays(x, y)
    ]
  )
  useGuarantiedClick(
    () => {
      clickStarted = false
      Viewport.locked = false
    },
    () => [OverlaysDaemon.state.editing, OverlaysDaemon.image !== undefined]
  )

  useMove(
    ({ x, y }) => {
      OverlaysDaemon.setPosition(
        x - startX + overlayStartX,
        y - startY + overlayStartY
      )
    },
    ({ x, y }) => [
      OverlaysDaemon.state.editing,
      OverlaysDaemon.image !== undefined,
      clickStarted,
      checkPointInsideOverlays(x, y)
    ]
  )
}

const overlaysRenderPlugin = () => {
  useRender(({ ctx }) => {
    const state = OverlaysDaemon.state

    if (state.mode === 1) {
      for (let i = 0; i < state.images.length; i++) {
        const image = state.images[i]
        ctx.beginPath()
        if (image.bitmap) {
          ctx.globalAlpha = image.opacity / 100
          // ctx.strokeStyle = 'black'
          // ctx.lineWidth = 1
          ctx.drawImage(image.bitmap!, image.x, image.y)
          // if (i === state.currentId && OverlaysDaemon.state.editing)
          //   this.renderUi(ctx, image)
          ctx.globalAlpha = 1
        }
        ctx.closePath()
      }
    } else if (state.mode === 0 && OverlaysDaemon.image) {
      const image = OverlaysDaemon.image
      ctx.beginPath()
      ctx.globalAlpha = image.opacity / 100
      if (image.bitmap) {
        ctx.drawImage(OverlaysDaemon.image.bitmap!, image.x, image.y)
        //if (OverlaysDaemon.state.editing)
        //  this.renderUi(ctx, OverlaysDaemon.image)
      }
      ctx.globalAlpha = 1
      ctx.closePath()
    }
  })
}

export const checkPointInsideOverlays = (x: number, y: number): boolean => {
  if (OverlaysDaemon.state.mode === 0)
    return OverlaysDaemon.image!.checkPointInside(x, y)
  else if (OverlaysDaemon.state.mode === 1)
    for (let i = 0; i < OverlaysDaemon.state.images.length; i++)
      if (
        OverlaysDaemon.state.images[i].checkPointInside(x, y) &&
        OverlaysDaemon.state.images[i].getPixel(x, y)?.color[3] !== 0
      )
        return true
  return false
}
