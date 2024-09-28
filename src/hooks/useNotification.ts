import { useEffect, useState } from 'preact/hooks'
import { config } from 'src/config'
import { NotificationDaemon } from 'src/core/daemons/notifications'
import { NotificationInfo } from 'src/core/daemons/types'

export const useNotification = (
  notification: NotificationInfo,
  style: string
) => {
  const [className, setClassName] = useState('')
  const [, setTime] = useState<NodeJS.Timeout>(setTimeout(() => {}, 0))

  useEffect(() => {
    setTime(
      setTimeout(() => {
        const animationTime = 200

        setClassName(style)
        setTimeout(
          () => NotificationDaemon.removeNotification(notification.id),
          animationTime
        )
      }, config.time.notificationRemoved)
    )
  }, [])

  return { className }
}
