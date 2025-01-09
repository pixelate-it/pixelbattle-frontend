import { useRef } from 'preact/hooks'
import { LoadScreen } from './LoadScreen'
import { useGame } from 'src/hooks/useGame'

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useGame(canvasRef)

  return (
    <>
      <LoadScreen />
      <canvas ref={canvasRef} />
    </>
  )
}
