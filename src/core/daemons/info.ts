import createStore, { Listener } from 'unistore'
import { InfoState } from './types'
import ApiRequest from '../classes/api/request'
import { ApiInfo } from '../classes/api/types'

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

  static async fetch() {
    ApiRequest.info().then((info: Pick<ApiInfo, keyof ApiInfo>) =>
      InfoDaemon.setState(info)
    )
  }

  private static setState(state: Partial<InfoState>) {
    InfoDaemon.store.setState(state as Pick<InfoState, keyof InfoState>)
  }

  static getState(): InfoState {
    return InfoDaemon.store.getState()
  }

  static on(f: Listener<InfoState>) {
    InfoDaemon.store.subscribe(f)
  }

  static off(f: Listener<InfoState>) {
    InfoDaemon.store.unsubscribe(f)
  }
}
