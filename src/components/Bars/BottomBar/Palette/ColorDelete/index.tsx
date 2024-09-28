import { Icon } from 'src/components/General/Icon'
import styles from './index.module.css'
import { useColorDelete } from 'src/hooks/palette/useColorDelete'

export const ColorDelete = () => {
  const { onClickStart, onClickCancel, onClickEnd, disabled } = useColorDelete()

  return (
    <button
      className={[styles.button, disabled ? styles.buttonDisabled : ''].join(
        ' '
      )}
      onMouseDown={onClickStart}
      onMouseUp={onClickEnd}
      onTouchStart={onClickStart}
      onTouchEnd={onClickEnd}
      onTouchCancel={onClickCancel}
    >
      <Icon
        icon='plus'
        className={styles.icon}
        alt={'Удалить выбранный цвет'}
      />
    </button>
  )
}
