import { Notifications } from 'src/components/Notifications'
import { Profile } from './Profile'
import { Tags } from './Tags'
import { Overlays } from './Overlays'
import styles from './index.module.styl'

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
