import styles from './index.module.css'
import './index.css'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { Button } from 'src/components/General/Button'
import { Icon } from 'src/components/General/Icon'
import { useColorCreate } from 'src/hooks/palette/useColorCreate'

export const ColorCreate = () => {
  const { open, color, setColor, toggle, onSelect, openPicker } =
    useColorCreate()

  return (
    <div className={styles.wrapper}>
      {open ? (
        <div className='color-picker'>
          <HexColorPicker color={color} onChange={setColor} />
          <HexColorInput color={color} onChange={setColor} prefixed />
          <div className={styles.buttons}>
            <Button onClick={onSelect}>Готово</Button>
            <Button onClick={toggle} type='danger'>
              Отмена
            </Button>
          </div>
        </div>
      ) : null}

      <button onClick={openPicker} className={styles.button}>
        <Icon icon='plus' className={styles.icon} alt={'Выбрать цвет'} />
        {/* <img
                    width={15}
                    height={15}
                    src="/images/icons/plus.svg"
                    className={styles.icon} /> */}
      </button>

      {/* <input
                type="color"
                name="create-color"
                className={styles.input}
                value={AppColor.getRandom().toHex()}
                onChange={e => palette.addAndSelect(new AppColor(e.currentTarget.value))}/> */}
    </div>
  )
}
