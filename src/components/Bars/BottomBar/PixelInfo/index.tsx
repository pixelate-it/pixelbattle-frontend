import { usePointer } from 'src/hooks/usePointer'
import { Coordinates } from './Coordinates'
import { Info } from './Info'

export const PixelInfo = ({ color }: { color: string }) => {
  const state = usePointer()

  return (
    <>
      <Coordinates
        coordinates={state.coordinates}
        empty={state.empty}
        color={color}
      />
      <Info info={state.info} color={color} />
    </>
  )
}
