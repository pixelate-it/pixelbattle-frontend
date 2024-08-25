import styles from './index.module.css'
import { Profile } from './Profile'

export function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Profile />
    </div>
  )
}
