import { WindowBox } from 'src/components/General/WindowBox'
import { OverlaysDaemon } from 'src/core/daemons/overlays'
import { useDaemon } from 'src/hooks/util/useDaemon'
import { OverlayTransform } from './Transform'
import { ImageSelect } from './ImageSelect'

export const Overlays = () => {
  const overlay = useDaemon(OverlaysDaemon)

  return (
    <WindowBox title='Изображения'>
      {overlay.image !== null ? <OverlayTransform /> : <ImageSelect />}
    </WindowBox>
  )
}
