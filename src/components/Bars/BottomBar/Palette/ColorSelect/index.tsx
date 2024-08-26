import styles from './index.module.css'
import { PaletteManager } from 'src/managers/palette'
import { AppColor } from 'src/classes/AppCanvas/AppColor'

interface ColorSelectProps {
  color: AppColor
  selected: AppColor
}

export const ColorSelect = ({ color, selected }: ColorSelectProps) => {
  return (
    <input
      type='radio'
      name='palette'
      value={color.toRGB()}
      className={styles.color}
      style={{
        backgroundColor: color.toRGB()
      }}
      checked={color.equals(selected)}
      onChange={() => PaletteManager.setCurrentColor(color)}
    />
  )
}
