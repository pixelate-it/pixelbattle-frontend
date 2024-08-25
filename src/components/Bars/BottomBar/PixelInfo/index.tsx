import { useEffect } from 'preact/hooks'
import { useBuffer } from 'src/hooks/useBuffer'
import { useStore } from 'src/hooks/useStore'
import { PointerStore, PointerManager } from 'src/managers/pointer'
import { PointerState } from 'src/types/managers'
import { Coordinates } from './Coordinates'
import { Info } from './Info'

export const PixelInfo = () => {
  const state = useStore<PointerState>(PointerStore)
  const coordinates = useBuffer(state.coordinates)

  useEffect(() => {
    PointerManager.fetchPixel()
  }, [coordinates])

  return (
    <>
      <Coordinates coordinates={state.coordinates} empty={state.empty} />
      <Info info={state.info} />
    </>
  )
}
