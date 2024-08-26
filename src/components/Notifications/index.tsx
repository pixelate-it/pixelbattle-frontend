import { NotificationsStore } from '../../managers/notifications'
import styles from './index.module.css'
import { useStore } from 'src/hooks/useStore'
import { Notification } from './Notification'

export const Notifications = () => {
  const notifications = useStore(NotificationsStore)

  return (
    <div className={styles.notifications}>
      {notifications.list.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
