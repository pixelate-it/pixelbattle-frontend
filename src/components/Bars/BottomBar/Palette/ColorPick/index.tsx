import { useStore } from 'src/hooks/useStore'
import { PickerManager, PickerStore } from 'src/managers/picker'
import styles from './index.module.css'
import { Icon } from 'src/components/General/Icon'

export const ColorPick = () => {
  const picker = useStore(PickerStore)

  return (
    <div className={styles.wrapper}>
      <input
        type='checkbox'
        name='color-pick'
        className={styles.input}
        onInput={() => PickerManager.toggle()}
        checked={picker.isEnabled}
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
