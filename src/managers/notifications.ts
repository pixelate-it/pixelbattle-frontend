import { NotificationInfo } from 'src/types/api'
import { NotificationState } from 'src/types/managers'
import createStore from 'unistore'

export const NotificationsStore = createStore<NotificationState>({ list: [] })

export const NotificationsManager = {
  addNotification(notification: Omit<NotificationInfo, 'id'>) {
    const notifications = NotificationsStore.getState().list
    if (notifications.length >= 5) {
      NotificationsStore.setState({ list: notifications.slice(1) })
    }

    NotificationsStore.setState({
      list: [
        ...notifications,
        {
          ...notification,
          id: Math.random().toString()
        }
      ]
    })
  },
  removeNotification(id: string) {
    NotificationsStore.setState({
      list: NotificationsStore.getState().list.filter((n) => n.id !== id)
    })
  }
}
