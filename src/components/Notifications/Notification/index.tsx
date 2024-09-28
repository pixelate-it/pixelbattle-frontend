import { NotificationInfo } from 'src/core/daemons/types'
import styles from './index.module.css'
import { useNotification } from 'src/hooks/useNotification'

export const Notification = ({
  notification
}: {
  notification: NotificationInfo
}) => {
  const { className } = useNotification(notification, styles.animate)

  return (
    <div
      className={[
        styles.notification,
        styles[notification.type],
        className
      ].join(' ')}
    >
      <p className={styles.title}>{notification.title}</p>
      <p className={styles.message}>{notification.message}</p>
    </div>
  )
}
