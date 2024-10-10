import { config } from 'src/config'
import { Viewport } from '../storage/viewport'
import { useLoaded, useRender } from '../utils/render/premitive'
import { CanvasStorage } from '../storage/canvas'

export const placePlugin = () => {
  useLoaded((event) => {
    let scale = event.canvasWidth / event.placeWidth
    if (scale > event.canvasHeight / event.placeHeight)
      scale = event.canvasHeight / event.placeHeight
    Viewport.realScale = Viewport.scale = scale
    Viewport.realX = Viewport.x =
      event.canvasWidth / 2 - (event.placeWidth / 2) * Viewport.scale
    Viewport.realY = Viewport.y =
      event.canvasHeight / 2 - (event.placeHeight / 2) * Viewport.scale
    Viewport.fix()
  })

  useRender(({ ctx, canvasWidth, canvasHeight }) => {
    Viewport.clearTransform(ctx)

    ctx.imageSmoothingEnabled = false

    ctx.beginPath()
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.fillStyle = config.defaults.colors.background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    ctx.closePath()

    Viewport.applyTransform(ctx)

    const chunk = CanvasStorage.getChunks()
    ctx.beginPath()
    ctx.fillRect(0, 0, CanvasStorage.width, CanvasStorage.height)
    ctx.closePath()
    for (const i in chunk) {
      if (chunk[i].renderBitmap) {
        ctx.beginPath()
        ctx.drawImage(chunk[i].renderBitmap, chunk[i].x, chunk[i].y)
        ctx.closePath()
      }
    }
  })

  // Mod tools is not added. :)
  // useRender(
  //   ({ ctx }) => {
  //     const chunks = CanvasStorage.getChunks()
  //     for (const i in chunks) {
  //       const chunk = chunks[i]
  //       const o = Date.now() - chunk.lastUpdateTime
  //       if (o < 1000) {
  //         ctx.strokeStyle = `#DF0000`
  //         ctx.globalAlpha = 1 - o / 1000
  //         ctx.lineWidth = 1
  //         ctx.moveTo(chunk.x + 1, chunk.y + 0.5)
  //         ctx.lineTo(chunk.x - 0.5 + chunk.width, chunk.y + 0.5)
  //         ctx.lineTo(chunk.x - 0.5 + chunk.width, chunk.y - 0.5 + chunk.height)
  //         ctx.lineTo(chunk.x + 0.5, chunk.y - 0.5 + chunk.height)
  //         ctx.lineTo(chunk.x + 0.5, chunk.y)
  //         ctx.stroke()
  //         ctx.globalAlpha = 1
  //         ctx.lineWidth = 1
  //       }
  //     }
  //   },
  //   () => [false]
  // )
}
