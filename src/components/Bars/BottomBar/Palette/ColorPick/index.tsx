import styles from './index.module.css'
import { Icon } from 'src/components/General/Icon'
import { useColorPick } from 'src/hooks/palette/useColorPick'

export const ColorPick = () => {
  const picker = useColorPick()

  return (
    <div className={styles.wrapper}>
      <input
        type='checkbox'
        name='color-pick'
        className={styles.input}
        onInput={() => picker.toggle()}
        checked={picker.pickerIsEnabled}
      />
      <Icon
        icon='color-picker'
        className={styles.icon}
        alt={'Пипетка'}
        viewBoxSize={21}
      />
    </div>
  )
}
