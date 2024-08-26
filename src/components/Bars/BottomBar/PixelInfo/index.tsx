import { Coordinates } from './Coordinates'
import { Info } from './Info'
import { usePointer } from 'src/hooks/usePointer'

export const PixelInfo = () => {
  const state = usePointer()

  return (
    <>
      <Coordinates coordinates={state.coordinates} empty={state.empty} />
      <Info info={state.info} />
    </>
  )
}
