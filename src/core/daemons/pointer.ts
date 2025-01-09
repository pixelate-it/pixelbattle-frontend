import createStore, { Listener } from 'unistore'
import { PointerState } from './types'
import ApiRequest from '../classes/api/request'

export class PointerDaemon {
  private static store = createStore<PointerState>({
    coordinates: [NaN, NaN],
    empty: true,
    info: null,
    visible: false
  })

  static setVisible(visible: boolean) {
    if (PointerDaemon.state.visible !== visible)
      PointerDaemon.setState({ visible })
  }

  static fetchPixel() {
    const state = PointerDaemon.state
    if (!state.coordinates[0] || !state.coordinates[1]) return
    PointerDaemon.setState({ info: 'loading' })

    ApiRequest.getPixel(state.coordinates[0], state.coordinates[1])
      .then((info) => PointerDaemon.setState({ info }))
      .catch((e) => console.error(e))
  }

  static setCoordinates(coordinates: [number, number]) {
    if (PointerDaemon.state.empty)
      PointerDaemon.setState({ coordinates, empty: false })
    else PointerDaemon.setState({ coordinates })
  }

  private static setState(state: Partial<PointerState>) {
    PointerDaemon.store.setState(
      state as Pick<PointerState, keyof PointerState>
    )
  }

  public static get state(): PointerState {
    return PointerDaemon.store.getState()
  }

  static on(f: Listener<PointerState>) {
    PointerDaemon.store.subscribe(f)
  }

  static off(f: Listener<PointerState>) {
    PointerDaemon.store.unsubscribe(f)
  }
}
