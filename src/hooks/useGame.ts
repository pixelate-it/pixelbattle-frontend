import { MutableRef, useEffect, useRef } from 'preact/hooks'
import { ApiWebSocket } from 'src/core/classes/api/ws'
import { PlaceIntegration } from 'src/core/place/integration'

export const useGame = (canvas: MutableRef<HTMLCanvasElement | null>) => {
  const placeRef = useRef<PlaceIntegration>()

  const resize = () => {
    if (!canvas.current) return

    canvas.current.width = window.innerWidth
    canvas.current.height = window.innerHeight
  }

  useEffect(() => {
    if (!canvas.current) return

    ApiWebSocket.connect()

    placeRef.current = new PlaceIntegration(canvas.current)
    resize()
    window.onresize = resize

    canvas.current?.addEventListener('wheel', placeRef.current.onWheel)
    canvas.current?.addEventListener('mousedown', placeRef.current.onMouseDown)
    canvas.current?.addEventListener('mouseup', placeRef.current.onMouseUp)
    canvas.current?.addEventListener('mousemove', placeRef.current.onMouseMove)
    canvas.current?.addEventListener(
      'contextmenu',
      placeRef.current.onContextMenu
    )
    canvas.current?.addEventListener(
      'mouseleave',
      placeRef.current.onMouseLeave
    )
    canvas.current?.addEventListener(
      'mouseenter',
      placeRef.current.onMouseEnter
    )
    canvas.current?.addEventListener(
      'touchstart',
      placeRef.current.onTouchStart
    )
    canvas.current?.addEventListener('touchend', placeRef.current.onTouchEnd)
    canvas.current?.addEventListener(
      'touchcancel',
      placeRef.current.onTouchCancel
    )
    canvas.current?.addEventListener('touchmove', placeRef.current.onTouchMove)

    return () => {
      window.onresize = null
      placeRef.current?.destroy()
      canvas.current?.removeEventListener('wheel', placeRef.current!.onWheel)
      canvas.current?.removeEventListener(
        'mousedown',
        placeRef.current!.onMouseDown
      )
      canvas.current?.removeEventListener(
        'mouseup',
        placeRef.current!.onMouseUp
      )
      canvas.current?.removeEventListener(
        'mousemove',
        placeRef.current!.onMouseMove
      )
      canvas.current?.removeEventListener(
        'contextmenu',
        placeRef.current!.onContextMenu
      )
      canvas.current?.removeEventListener(
        'mouseleave',
        placeRef.current!.onMouseLeave
      )
      canvas.current?.removeEventListener(
        'mouseenter',
        placeRef.current!.onMouseEnter
      )
      canvas.current?.removeEventListener(
        'touchstart',
        placeRef.current!.onTouchStart
      )
      canvas.current?.removeEventListener(
        'touchend',
        placeRef.current!.onTouchEnd
      )
      canvas.current?.removeEventListener(
        'touchcancel',
        placeRef.current!.onTouchCancel
      )
      canvas.current?.removeEventListener(
        'touchmove',
        placeRef.current!.onTouchMove
      )
    }
  }, [])
}
