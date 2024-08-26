import { AppConfig } from 'src/classes/AppConfig'
import styles from './index.module.css'
import { useEffect, useState } from 'preact/hooks'
import { NotificationsManager } from 'src/managers/notifications'
import { NotificationInfo } from 'src/types/api'

export const Notification = ({
  notification
}: {
  notification: NotificationInfo
}) => {
  const [className, setClassName] = useState('')
  const [, setTime] = useState<NodeJS.Timeout>(setTimeout(() => {}, 0))

  useEffect(() => {
    setTime(
      setTimeout(() => {
        const animationTime = 200

        setClassName(styles.animate)
        setTimeout(
          () => NotificationsManager.removeNotification(notification.id),
          animationTime
        )
      }, AppConfig.time.notificationRemoved)
    )
  }, [])

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
