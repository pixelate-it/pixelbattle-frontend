import { useRef } from 'preact/hooks'
import { LoadScreen } from './LoadScreen'
import { useStoreSelector } from 'src/hooks/useStoreSelector'
import { useGame } from 'src/hooks/useGame'
import { GeneralState } from 'src/types/managers'
import { GeneralStore } from 'src/managers/general'

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useGame(canvasRef)
  const { canvasLoaded } = useStoreSelector<
    GeneralState,
    { canvasLoaded: boolean }
  >(GeneralStore, ['canvasLoaded'])

  return (
    <>
      {!canvasLoaded && <LoadScreen />}
      <canvas ref={canvasRef} />
    </>
  )
}
