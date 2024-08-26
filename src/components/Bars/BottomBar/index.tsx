import { Cooldown } from './Cooldown'
import styles from './index.module.css'
import { Palette } from './Palette'
import { PixelInfo } from './PixelInfo'

export const BottomBar = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.coordinates}>
        <PixelInfo />
      </div>

      <div className={styles.cooldown}>
        <Cooldown />
      </div>

      <div className={styles.palette}>
        <Palette />
      </div>
    </div>
  )
}
