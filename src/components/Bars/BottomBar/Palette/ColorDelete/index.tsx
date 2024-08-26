import { Icon } from 'src/components/General/Icon'
import styles from './index.module.css'
import { PaletteManager, PaletteStore } from 'src/managers/palette'

export const ColorDelete = () => {
  const onClick = (event: MouseEvent) => {
    if (event.shiftKey) {
      PaletteManager.reset()
      return
    }

    if (!PaletteManager.isDefaultColor(PaletteStore.getState().selected))
      PaletteManager.removeColor(PaletteStore.getState().selected)
  }

  return (
    <button className={styles.button} onClick={onClick}>
      <Icon
        icon='plus'
        className={styles.icon}
        alt={'Удалить выбранный цвет'}
      />
    </button>
  )
}
