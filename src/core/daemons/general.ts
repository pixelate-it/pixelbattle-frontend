import createStore, { Listener } from 'unistore'
import ApiRequest from '../classes/api/request'
import { CanvasStorage } from '../place/storage/canvas'
import { InfoDaemon } from './info'
import { PaletteDaemon } from './palette'
import { ProfileDaemon } from './profile'
import { TagsDaemon } from './tags'
import { GeneralState } from './types'
import { OverlaysDaemon } from './overlays'

export const GeneralStore = createStore<GeneralState>({
  canvasLoaded: false,
  infoLoaded: false
})

export class GeneralDaemon {
  private static store = createStore<GeneralState>({
    canvasLoaded: false,
    infoLoaded: false
  })

  private static fetchCanvas() {
    ApiRequest.pixels().then(async (v) => {
      CanvasStorage.process(v)
      GeneralDaemon.setState({ canvasLoaded: true })
    })
  }

  static run() {
    InfoDaemon.fetch()
    GeneralDaemon.fetchCanvas()
    PaletteDaemon.load()
    ProfileDaemon.load()
    ProfileDaemon.fetch()
    OverlaysDaemon.load()
    TagsDaemon.fetch()
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
