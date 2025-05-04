import { Cooldown } from './Cooldown'
import { Palette } from './Palette'
import { PixelInfo } from './PixelInfo'
import styles from './index.module.styl'

export const BottomBar = ({ color }: { color: string }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.coordinates}>
        <PixelInfo color={color} />
      </div>

      <div className={styles.cooldown}>
        <Cooldown color={color} />
      </div>

      <div className={styles.palette}>
        <Palette />
      </div>
    </div>
  )
}
