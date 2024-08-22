import { useEffect, useRef } from 'preact/hooks'
import { AppGame } from 'src/classes/AppGame'
import { AppWebSocket } from 'src/classes/AppWebSocket/AppWebSocket'
import { CanvasStore } from 'src/stores/canvas'
import { LoadScreen } from './LoadScreen'
import { useStoreSelector } from 'src/hooks/useStoreSelector'
import { CanvasState } from 'src/types/stores'

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameRef = useRef<AppGame>()
  const webSocketRef = useRef<AppWebSocket>()
  const frameRef = useRef<number>(0)
  const { canvasPrepared } = useStoreSelector<
    CanvasState,
    { canvasPrepared: boolean }
  >(CanvasStore, ['canvasPrepared'])

  const resize = () => {
    if (!canvasRef.current) return

    canvasRef.current.width = window.innerWidth
    canvasRef.current.height = window.innerHeight
  }

  const render = (timestamp: number) => {
    gameRef.current!.render(timestamp)
    frameRef.current = requestAnimationFrame(render)
  }

  const onMouseMove = (e: MouseEvent) => {
    const pointerCoordinates = gameRef.current!.onMouseMove(e)
    if (pointerCoordinates)
      CanvasStore.setState({
        pointerCoordinates
      })
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
    canvasRef.current?.addEventListener('mousemove', onMouseMove)
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
      canvasRef.current?.removeEventListener('mousemove', onMouseMove)
      canvasRef.current?.removeEventListener(
        'contextmenu',
        gameRef.current!.onContextMenu
      )
    }
  }, [])

  return (
    <>
      {!canvasPrepared && <LoadScreen />}
      <canvas ref={canvasRef} />
    </>
  )
}
