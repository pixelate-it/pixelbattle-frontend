import createStore, { Listener } from 'unistore'
import ApiRequest from '../classes/api/request'
import { CanvasStorage } from '../place/storage/canvas'
import { InfoDaemon } from './info'
import { PaletteDaemon } from './palette'
import { ProfileDaemon } from './profile'
import { TagsDaemon } from './tags'
import { GeneralState } from './types'
import { OverlaysDaemon } from './overlays'
import { CriticalError } from '../util/Errors'

export class GeneralDaemon {
  private static store = createStore<GeneralState>({
    ready: false
  })

  static setReadyStatus(ready: boolean) {
    GeneralDaemon.setState({ ready, error: undefined })
  }

  static setError(error: Error) {
    console.log(error)
    //if (!(GeneralDaemon.state.error instanceof CriticalError))
    GeneralDaemon.setState({
      ready: false,
      error: error
    })
  }

  static setReconnecting(reconnecting: boolean, attempts: number) {
    GeneralDaemon.setState({ reconnecting, attempts })
  }

  private static fetchCanvas() {
    ApiRequest.pixels().then(async (v) => {
      CanvasStorage.process(v)
      GeneralDaemon.setState({ ready: true })
    })
  }

  static run() {
    InfoDaemon.fetch()
    GeneralDaemon.fetchCanvas()
    PaletteDaemon.load()
    ProfileDaemon.load()
    ProfileDaemon.fetch()
    OverlaysDaemon.loadOverlays()
    TagsDaemon.fetch()
  }

  static reconnectRun() {
    InfoDaemon.fetch()
    GeneralDaemon.fetchCanvas()
    ProfileDaemon.fetch()
  }

  private static setState(state: Partial<GeneralState>) {
    GeneralDaemon.store.setState(
      state as Pick<GeneralState, keyof GeneralState>
    )
  }

  static get state(): GeneralState {
    return GeneralDaemon.store.getState()
  }

  static on(f: Listener<GeneralState>) {
    GeneralDaemon.store.subscribe(f)
  }

  static off(f: Listener<GeneralState>) {
    GeneralDaemon.store.unsubscribe(f)
  }
}
