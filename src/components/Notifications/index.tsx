import { NotificationDaemon } from 'src/core/daemons/notifications'
import { Notification } from './Notification'
import { useDaemon } from 'src/hooks/util/useDaemon'
import styles from './index.module.styl'

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
