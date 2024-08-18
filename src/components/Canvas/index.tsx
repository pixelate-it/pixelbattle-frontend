import { useEffect, useRef } from 'preact/hooks'
import { AppGame } from 'src/classes/AppGame'
import { AppWebSocket } from 'src/classes/AppWebSocket/AppWebSocket'

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<AppGame>()
  const webSocketRef = useRef<AppWebSocket>()
  const frameRef = useRef<number>(0)

  const resize = () => {
    if (!canvasRef.current) return

    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight
  }

  const render = (timestamp: number) => {
    gameRef.current!.render(timestamp)
    frameRef.current = requestAnimationFrame(render)
  }

  useEffect(() => {
    window.onresize = resize
    resize()

    gameRef.current = new AppGame(canvasRef.current!)
    webSocketRef.current = new AppWebSocket(gameRef)
    webSocketRef.current.connect()

    requestAnimationFrame(render)
    canvasRef.current?.addEventListener('wheel', gameRef.current.onWheel)
    canvasRef.current?.addEventListener(
      'mousedown',
      gameRef.current.onMouseDown
    )
    canvasRef.current?.addEventListener('mouseup', gameRef.current.onMouseUp)
    canvasRef.current?.addEventListener(
      'mousemove',
      gameRef.current.onMouseMove
    )
    canvasRef.current?.addEventListener(
      'contextmenu',
      gameRef.current.onContextMenu
    )

    return () => {
      window.onresize = null
      cancelAnimationFrame(frameRef.current)
      canvasRef.current?.removeEventListener('wheel', gameRef.current!.onWheel)
      canvasRef.current?.removeEventListener(
        'mousedown',
        gameRef.current!.onMouseDown
      )
      canvasRef.current?.removeEventListener(
        'mouseup',
        gameRef.current!.onMouseUp
      )
      canvasRef.current?.removeEventListener(
        'mousemove',
        gameRef.current!.onMouseMove
      )
      canvasRef.current?.removeEventListener(
        'contextmenu',
        gameRef.current!.onContextMenu
      )
    }
  }, [])

  return <canvas ref={canvasRef} />
}
