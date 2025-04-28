import { useImageTransform } from 'src/hooks/overlay/useOverlayTransform'
import styles from './index.module.css'
import { Button } from 'src/components/General/Button'
import { Icon } from 'src/components/General/Icon'
import { TextField } from 'src/components/General/TextFIeld'

export const OverlayTransform = () => {
  const {
    overlay,
    changeOpacity,
    changeCoords,
    info,
    unsetImage,
    addImage,
    nextImage,
    prevImage,
    reuploadImage
  } = useImageTransform()

  return (
    <div class={styles.wrapper}>
      <div class={styles.image}>
        <p class={styles.imageName}>
          {overlay.overlays[overlay.currentOverlay].imageName}
        </p>
        <Button onClick={reuploadImage} type='primary'>
          <Icon icon='open-folder' />
        </Button>
      </div>
      <div class={styles.image}>
        <Button
          onClick={prevImage}
          type='primary'
          disabled={!overlay.prevOverlayButtonActive}
          full={true}
        >
          <Icon icon='left' />
        </Button>

        <Button onClick={addImage} type='primary' full={true}>
          <Icon icon='plus' />
        </Button>
        <Button onClick={unsetImage} type='danger' full={true}>
          <Icon icon='plus' className={styles.removeIcon} />
        </Button>

        <Button
          onClick={nextImage}
          type='primary'
          disabled={!overlay.nextOverlayButtonActive}
          full={true}
        >
          <Icon icon='left' className={styles.rightIcon} />
        </Button>
      </div>
      <div class={styles.groups}>
        <div class={styles.group}>
          <p class={styles.groupTitle}>Координаты</p>
          <div class={styles.coordinates}>
            <TextField
              max={info.canvas.width}
              type='number'
              placeholder='X координата'
              defaultValue={overlay.overlays[
                overlay.currentOverlay
              ].x.toString()}
              onInput={(input) => changeCoords('x', parseInt(input))}
            />
            <TextField
              max={info.canvas.height}
              type='number'
              placeholder='Y координата'
              defaultValue={overlay.overlays[
                overlay.currentOverlay
              ].y.toString()}
              onInput={(input) => changeCoords('y', parseInt(input))}
            />
          </div>
        </div>
        <div class={styles.group}>
          <p class={styles.groupTitle}>Прозрачность</p>
          <TextField
            min={0}
            max={100}
            type='number'
            placeholder='Прозрачность'
            defaultValue={overlay.overlays[
              overlay.currentOverlay
            ].opacity!.toString()}
            onInput={changeOpacity}
          />
        </div>
      </div>
    </div>
  )
}
