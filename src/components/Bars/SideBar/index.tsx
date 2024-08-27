import { Notifications } from 'src/components/Notifications'
import styles from './index.module.css'
import { Profile } from './Profile'
import { Tags } from './Tags'

export function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Profile />
      <Tags />

      <Notifications />
    </div>
  )
}
