import { useLoaded, useRender } from '../utils/render/primitive'
import { Vector } from '../../util/vector'
import { Viewport, CanvasStorage } from 'src/core/storage'

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

  useRender(({ graphics }) => {
    Viewport.smoothMove()

    const chunks = CanvasStorage.getChunks()
    graphics.preRender()
    for (const chunk of chunks) {
      graphics.drawImage(chunk.x, chunk.y, chunk.imageData)
    }
  })
}
