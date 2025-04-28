import Color from 'src/core/util/сolor'
import styles from './index.module.css'
import { PaletteDaemon } from 'src/core/daemons/palette'

interface ColorSelectProps {
  color: Color
  selected: Color
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
      onChange={() => PaletteDaemon.setCurrentColor(color)}
    />
  )
}
