import { Viewport } from '../storage/viewport'
import { useLoaded, useRender } from '../utils/render/premitive'
import { CanvasStorage } from '../storage/canvas'
import { Vector } from '../util/Vector'

export const placePlugin = () => {
  useLoaded((event) => {
    Viewport.screenWidth = window.innerWidth
    Viewport.screenHeight = window.innerHeight
    Viewport.worldWidth = window.innerWidth * 2
    Viewport.worldHeight = window.innerHeight * 2

    Viewport.fit(new Vector(event.placeWidth, event.placeHeight))
    Viewport.zoomPercent(-0.25)
    Viewport.minWidth = Viewport.worldWidth / 500
    Viewport.minHeight = Viewport.worldHeight / 500
    Viewport.maxWidth = event.placeWidth * 5
    Viewport.maxHeight = event.placeHeight * 5
    Viewport.moveCenter(new Vector(event.placeWidth / 2, event.placeHeight / 2))
  })

  useRender(({ graphics, delta }) => {
    // Viewport.clearTransform(ctx)

    // // ctx.imageSmoothingEnabled = false

    // // ctx.beginPath()
    // ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    // ctx.fillStyle = config.defaults.colors.background
    // ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    // ctx.closePath()

    // Viewport.applyTransform(ctx)
    Viewport.smoothMove(delta)

    const chunks = CanvasStorage.getChunks()
    graphics.preRender()
    // ctx.beginPath()
    // ctx.fillRect(0, 0, CanvasStorage.width, CanvasStorage.height)
    // ctx.closePath()
    for (const chunk of chunks) {
      graphics.drawImage(chunk.x, chunk.y, chunk.imageData)
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
