import { Viewport } from '../../storage/viewport'
import { Vector } from '../../util/Vector'
import {
  useTouchCancel,
  useTouchEnd,
  useTouchMove,
  useTouchStart
} from '../../utils/movement/primitive'

export const touchScreenPlugin = () => {
  let last: Vector | null
  let moved = false

  useTouchStart((event) => {
    last = Viewport.toLocal(event.touches[0].clientX, event.touches[0].clientY)
  })

  useTouchCancel((event) => {})

  useTouchEnd((event) => {})

  useTouchMove((event) => {
    const touches = event.touches

    if (touches.length >= 2) {
      const first = touches[0]
      const second = touches[1]
      const last = Math.sqrt(
        Math.pow(second.clientX - first.clientX, 2) +
          Math.pow(second.clientY - first.clientY, 2)
      )

      let oldPoint: Vector | undefined

      const point = new Vector(
        first.clientX + (second.clientX - first.clientX) / 2,
        first.clientY + (second.clientY - first.clientX) / 2
      )

      oldPoint = Viewport.toLocal(point.x, point.y)
      let dist = Math.sqrt(
        Math.pow(second.clientX - first.clientX, 2) +
          Math.pow(second.clientY - first.clientY, 2)
      )

      dist = dist === 0 ? (dist = 0.0000000001) : dist

      const change = (1 - last / dist) * Viewport.scale

      Viewport.scale += change

      Viewport.clampZoom()
      const newPoint = Viewport.toLocal(oldPoint.x, oldPoint.y)

      Viewport.x += point.x - newPoint.x
      Viewport.y += point.y - newPoint.y
    }
    if (last && touches.length === 1) {
      const touch = touches[0]

      const newPoint = Viewport.toLocal(touch.clientX, touch.clientY)

      const distX = newPoint.x - last.x
      const distY = newPoint.y - last.y

      if (moved || checkThreshold(distX) || checkThreshold(distY)) {
        Viewport.x += newPoint.x - last.x
        Viewport.y += newPoint.y - last.y
        last = newPoint

        moved = true
      } else {
        moved = false
      }
    }
  })

  const checkThreshold = (change: number) => Math.abs(change) >= 10
}
