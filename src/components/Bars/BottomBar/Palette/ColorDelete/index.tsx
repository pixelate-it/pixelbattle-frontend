import { Icon } from 'src/components/General/Icon'
import styles from './index.module.css'
import { PaletteManager, PaletteStore } from 'src/managers/palette'
import { useRef } from 'preact/hooks'
import { AppConfig } from 'src/classes/AppConfig'

export const ColorDelete = () => {
  const timeRef = useRef<NodeJS.Timeout>()

  const onClick = (event: MouseEvent) => {
    if (event.shiftKey) {
      PaletteManager.reset()
      return
    }

    if (!PaletteManager.isDefaultColor(PaletteStore.getState().selected))
      PaletteManager.removeColor(PaletteStore.getState().selected)
  }

  const onPress = () => {
    timeRef.current = setTimeout(
      () => PaletteManager.reset(),
      AppConfig.time.palette.deleteButtonPress
    )
  }

  const onUnPress = () => {
    if (timeRef.current) clearTimeout(timeRef.current)
  }

  return (
    <button
      className={styles.button}
      onClick={onClick}
      onMouseDown={onPress}
      onMouseUp={onUnPress}
      onTouchStart={onPress}
      onTouchEnd={onPress}
      onTouchCancel={onUnPress}
    >
      <Icon
        icon='plus'
        className={styles.icon}
        alt={'Удалить выбранный цвет'}
      />
    </button>
  )
}
