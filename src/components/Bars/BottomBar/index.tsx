import styles from './index.module.css'
import { PixelInfo } from './PixelInfo'

export const BottomBar = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.coordinates}>
        <PixelInfo />
      </div>
    </div>
  )
}
