import { MutableRef, useEffect, useRef } from 'preact/hooks'
import { AppGame } from 'src/classes/AppGame'
import { AppWebSocket } from 'src/classes/AppWebSocket'

export const useGame = (canvas: MutableRef<HTMLCanvasElement | null>) => {
  const gameRef = useRef<AppGame>()
  const frameRef = useRef<number>(0)

  const resize = () => {
    if (!canvas.current) return

    canvas.current.width = window.innerWidth
    canvas.current.height = window.innerHeight
  }

  const render = (timestamp: number) => {
    gameRef.current!.render(timestamp)
    frameRef.current = requestAnimationFrame(render)
  }

  useEffect(() => {
    if (!canvas.current) return

    AppWebSocket.connect()

    gameRef.current = new AppGame(canvas.current)
    resize()
    window.onresize = resize

    requestAnimationFrame(render)
    canvas.current?.addEventListener('wheel', gameRef.current.onWheel)
    canvas.current?.addEventListener('mousedown', gameRef.current.onMouseDown)
    canvas.current?.addEventListener('mouseup', gameRef.current.onMouseUp)
    canvas.current?.addEventListener('mousemove', gameRef.current.onMouseMove)
    canvas.current?.addEventListener(
      'contextmenu',
      gameRef.current.onContextMenu
    )
    canvas.current?.addEventListener('mouseleave', gameRef.current.onMouseLeave)
    canvas.current?.addEventListener('mouseenter', gameRef.current.onMouseEnter)

    return () => {
      window.onresize = null
      cancelAnimationFrame(frameRef.current)
      canvas.current?.removeEventListener('wheel', gameRef.current!.onWheel)
      canvas.current?.removeEventListener(
        'mousedown',
        gameRef.current!.onMouseDown
      )
      canvas.current?.removeEventListener('mouseup', gameRef.current!.onMouseUp)
      canvas.current?.removeEventListener(
        'mousemove',
        gameRef.current!.onMouseMove
      )
      canvas.current?.removeEventListener(
        'contextmenu',
        gameRef.current!.onContextMenu
      )
      canvas.current?.removeEventListener(
        'mouseleave',
        gameRef.current!.onMouseLeave
      )
      canvas.current?.removeEventListener(
        'mouseenter',
        gameRef.current!.onMouseEnter
      )
    }
  }, [])
}
