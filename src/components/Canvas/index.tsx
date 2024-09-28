import { useRef } from 'preact/hooks'
import { LoadScreen } from './LoadScreen'
import { useGame } from 'src/hooks/useGame'
import { useDaemon } from 'src/hooks/util/useDaemon'
import { GeneralDaemon } from 'src/core/daemons/general'

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useGame(canvasRef)
  const { canvasLoaded } = useDaemon(GeneralDaemon)

  return (
    <>
      {!canvasLoaded && <LoadScreen />}
      <canvas ref={canvasRef} />
    </>
  )
}
