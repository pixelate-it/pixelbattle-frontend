import { NotificationInfo } from 'src/core/daemons/types'
import { useNotification } from 'src/hooks/useNotification'
import styles from './index.module.styl'

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
