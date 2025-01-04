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
      {overlay.currentOverlay !== -1 ? (
        <>
          <OverlayTransform />
          <div className={styles.group}>
            <Button onClick={nextMode}>
              {overlay.viewMode === 0
                ? 'Режим одного изображения'
                : overlay.viewMode === 1
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
