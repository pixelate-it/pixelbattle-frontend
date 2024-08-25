import { AppRequests } from 'src/classes/AppRequests'
import { PointerState } from 'src/types/managers'
import createStore from 'unistore'

export const PointerStore = createStore<PointerState>({
  coordinates: [NaN, NaN],
  empty: true,
  info: null
})

export const PointerManager = {
  fetchPixel() {
    const state = PointerStore.getState()
    if (!state.coordinates[0] || !state.coordinates[1]) return
    PointerStore.setState({ info: 'loading' })

    AppRequests.getPixel(state.coordinates[0], state.coordinates[1])
      .then((info) => PointerStore.setState({ info }))
      .catch((e) => console.error(e))
  },
  setCoordinates(coordinates: [number, number]) {
    if (PointerStore.getState().empty)
      PointerStore.setState({ coordinates, empty: false })
    else PointerStore.setState({ coordinates })
  }
}
