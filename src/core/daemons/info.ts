import createStore, { Listener } from 'unistore'
import { ApiInfo, InfoState } from './types'
import RequestsDaemon from './requests'

/**
 * The daemon is responsible for storing and receiving information about the game
 */
export class InfoDaemon {
  private static store = createStore<InfoState>({
    name: 'Загрузка...',
    ended: true,
    cooldown: Infinity,
    online: 0,
    canvas: {
      width: -Infinity,
      height: -Infinity
    }
  })

  /**
   * Fetches information of current game
   */
  static async fetch() {
    RequestsDaemon.info().then((info: Pick<ApiInfo, keyof ApiInfo>) =>
      InfoDaemon.setState(info)
    )
  }

  private static setState(state: Partial<InfoState>) {
    InfoDaemon.store.setState(state as Pick<InfoState, keyof InfoState>)
  }

  /**
   * Contains information of current game
   */
  static get state(): InfoState {
    return InfoDaemon.store.getState()
  }

  /**
   * Subscribe to updates of this daemon
   * @param f Event listener
   */
  static on(f: Listener<InfoState>) {
    InfoDaemon.store.subscribe(f)
  }

  /**
   * Unsubscribe to updates of this daemon
   * @param f Event listener
   */
  static off(f: Listener<InfoState>) {
    InfoDaemon.store.unsubscribe(f)
  }
}
