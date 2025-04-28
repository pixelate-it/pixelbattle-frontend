import createStore, { Listener } from 'unistore'
import { NotificationInfo, NotificationState } from './types'

/**
 * The daemon is responsible for <Notifications /> or just pop-up messages at canvas
 */
export class NotificationDaemon {
  private static store = createStore<NotificationState>({ list: [] })

  /**
   * Add's notification to list, for display it on game
   * @param notification object with (message, title, id? in string), and type in NotificationType
   */
  static addNotification(notification: Omit<NotificationInfo, 'id'>) {
    const notifications = NotificationDaemon.state.list
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

  /**
   * Removes notification from list, by id.
   * Uses in <Notifications />, for clear old notifications
   * @param id of notification
   */
  static removeNotification(id: string) {
    NotificationDaemon.setState({
      list: NotificationDaemon.state.list.filter((n) => n.id !== id)
    })
  }

  private static setState(state: Partial<NotificationState>) {
    NotificationDaemon.store.setState(
      state as Pick<NotificationState, keyof NotificationState>
    )
  }

  static get state(): NotificationState {
    return NotificationDaemon.store.getState()
  }

  /**
   * Subscribe to updates of this daemon
   * @param f Event listener
   */
  static on(f: Listener<NotificationState>) {
    NotificationDaemon.store.subscribe(f)
  }

  /**
   * Unsubscribe to updates of this daemon
   * @param f Event listener
   */
  static off(f: Listener<NotificationState>) {
    NotificationDaemon.store.unsubscribe(f)
  }
}
