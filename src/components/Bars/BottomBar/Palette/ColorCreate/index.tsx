import { useState } from 'preact/hooks'
import { AppColor } from 'src/classes/AppCanvas/AppColor'
import { useStoreSelector } from 'src/hooks/useStoreSelector'
import { PaletteManager, PaletteStore } from 'src/managers/palette'
import { PaletteState } from 'src/types/managers'
import styles from './index.module.css'
import './index.css'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { Button } from 'src/components/General/Button'
import { Icon } from 'src/components/General/Icon'

export const ColorCreate = () => {
  const { selected } = useStoreSelector<PaletteState, { selected: AppColor }>(
    PaletteStore,
    ['selected']
  )
  const [color, setColor] = useState(selected.toHex())
  const [open, setOpen] = useState(false)

  function onSelect() {
    setOpen(!open)

    PaletteManager.addAndSelect(new AppColor(color))
  }

  function toggle() {
    setOpen(!open)
  }

  function openPicker() {
    setColor(selected.toHex())

    toggle()
  }

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
