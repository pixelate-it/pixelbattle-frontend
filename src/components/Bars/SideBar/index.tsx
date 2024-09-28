import { Notifications } from 'src/components/Notifications'
import styles from './index.module.css'
import { Profile } from './Profile'
import { Tags } from './Tags'
import { Overlays } from './Overlays'

export function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Profile />
      <Tags />
      <Overlays />

      <Notifications />
    </div>
  )
}
