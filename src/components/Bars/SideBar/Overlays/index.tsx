import { WindowBox } from 'src/components/General/WindowBox'
import { ImageSelect } from './ImageSelect'
import { useOverlays } from 'src/hooks/overlay/useOverlays'
import { Button } from 'src/components/General/Button'
import { OverlayTransform } from './OverlayTransform'
import styles from './index.module.css'

export const Overlays = () => {
  const { overlay, nextMode } = useOverlays()

  return (
    <WindowBox title='Изображения'>
      {overlay.images.length !== 0 &&
      overlay.images[overlay.currentId] !== undefined ? (
        <>
          <OverlayTransform />
          <div className={styles.group}>
            <Button onClick={nextMode}>
              {overlay.mode === 0
                ? 'Режим одного изображения'
                : overlay.mode === 1
                  ? 'Режим всех изображений'
                  : 'Изображения скрыты'}
            </Button>
          </div>
        </>
      ) : (
        <ImageSelect />
      )}
    </WindowBox>
  )
}
