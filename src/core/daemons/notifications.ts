import createStore, { Listener } from 'unistore'
import { NotificationInfo, NotificationState } from './types'

export class NotificationDaemon {
  private static store = createStore<NotificationState>({ list: [] })

  static addNotification(notification: Omit<NotificationInfo, 'id'>) {
    const notifications = NotificationDaemon.getState().list
    if (notifications.length >= 5) {
      NotificationDaemon.setState({ list: notifications.slice(1) })
    }

    NotificationDaemon.setState({
      list: [
        ...notifications,
        {
          ...notification,
          id: Math.random().toString()
        }
      ]
    })
  }

  static removeNotification(id: string) {
    NotificationDaemon.setState({
      list: NotificationDaemon.getState().list.filter((n) => n.id !== id)
    })
  }

  private static setState(state: Partial<NotificationState>) {
    NotificationDaemon.store.setState(
      state as Pick<NotificationState, keyof NotificationState>
    )
  }

  static getState(): NotificationState {
    return NotificationDaemon.store.getState()
  }

  static on(f: Listener<NotificationState>) {
    NotificationDaemon.store.subscribe(f)
  }

  static off(f: Listener<NotificationState>) {
    NotificationDaemon.store.unsubscribe(f)
  }
}
