import { MutableRef, useEffect, useRef } from 'preact/hooks'
import { ApiWebSocket } from 'src/core/classes/api/ws'
import { PlaceMovement } from 'src/core/place/movement'
import { PlaceRender } from 'src/core/place/render'

export const useGame = (canvas: MutableRef<HTMLCanvasElement | null>) => {
  const placeRenderRef = useRef<PlaceRender>()
  const placeMovementRef = useRef<PlaceMovement>()
  const frameRef = useRef<number>(0)

  const resize = () => {
    if (!canvas.current) return

    canvas.current.width = window.innerWidth
    canvas.current.height = window.innerHeight
  }

  const render = () => {
    placeRenderRef.current!.render()
    frameRef.current = requestAnimationFrame(render)
  }

  useEffect(() => {
    if (!canvas.current) return

    ApiWebSocket.connect()

    placeRenderRef.current = new PlaceRender(canvas.current)
    placeMovementRef.current = new PlaceMovement(canvas.current)
    resize()
    window.onresize = resize

    requestAnimationFrame(render)
    canvas.current?.addEventListener('wheel', placeMovementRef.current.onWheel)
    canvas.current?.addEventListener(
      'mousedown',
      placeMovementRef.current.onMouseDown
    )
    canvas.current?.addEventListener(
      'mouseup',
      placeMovementRef.current.onMouseUp
    )
    canvas.current?.addEventListener(
      'mousemove',
      placeMovementRef.current.onMouseMove
    )
    canvas.current?.addEventListener(
      'contextmenu',
      placeMovementRef.current.onContextMenu
    )
    canvas.current?.addEventListener(
      'mouseleave',
      placeMovementRef.current.onMouseLeave
    )
    canvas.current?.addEventListener(
      'mouseenter',
      placeMovementRef.current.onMouseEnter
    )
    canvas.current?.addEventListener(
      'touchstart',
      placeMovementRef.current.onTouchStart
    )
    canvas.current?.addEventListener(
      'touchend',
      placeMovementRef.current.onTouchEnd
    )
    canvas.current?.addEventListener(
      'touchcancel',
      placeMovementRef.current.onTouchCancel
    )
    canvas.current?.addEventListener(
      'touchmove',
      placeMovementRef.current.onTouchMove
    )

    return () => {
      window.onresize = null
      cancelAnimationFrame(frameRef.current)
      canvas.current?.removeEventListener(
        'wheel',
        placeMovementRef.current!.onWheel
      )
      canvas.current?.removeEventListener(
        'mousedown',
        placeMovementRef.current!.onMouseDown
      )
      canvas.current?.removeEventListener(
        'mouseup',
        placeMovementRef.current!.onMouseUp
      )
      canvas.current?.removeEventListener(
        'mousemove',
        placeMovementRef.current!.onMouseMove
      )
      canvas.current?.removeEventListener(
        'contextmenu',
        placeMovementRef.current!.onContextMenu
      )
      canvas.current?.removeEventListener(
        'mouseleave',
        placeMovementRef.current!.onMouseLeave
      )
      canvas.current?.removeEventListener(
        'mouseenter',
        placeMovementRef.current!.onMouseEnter
      )
      canvas.current?.removeEventListener(
        'touchstart',
        placeMovementRef.current!.onTouchStart
      )
      canvas.current?.removeEventListener(
        'touchend',
        placeMovementRef.current!.onTouchEnd
      )
      canvas.current?.removeEventListener(
        'touchcancel',
        placeMovementRef.current!.onTouchCancel
      )
      canvas.current?.removeEventListener(
        'touchmove',
        placeMovementRef.current!.onTouchMove
      )
    }
  }, [])
}
