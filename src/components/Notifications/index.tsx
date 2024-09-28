import { NotificationDaemon } from 'src/core/daemons/notifications'
import styles from './index.module.css'
import { Notification } from './Notification'
import { useDaemon } from 'src/hooks/util/useDaemon'

export const Notifications = () => {
  const notifications = useDaemon(NotificationDaemon)

  return (
    <div className={styles.notifications}>
      {notifications.list.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
