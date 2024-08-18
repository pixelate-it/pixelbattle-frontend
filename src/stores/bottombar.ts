import { AppRequests } from 'src/classes/AppRequests'
import { BottomBarState } from 'src/types/stores/bottombar'
import createStore from 'unistore'

export const BottomBarStore = createStore<BottomBarState>({
  coordinates: [0, 0],
  info: null
})

export const BottomBarManager = {
  async fetchPixel() {
    const state = BottomBarStore.getState()
    if (!state.coordinates[0] || !state.coordinates[1]) return
    console.log()

    const info = await AppRequests.getPixel(
      state.coordinates[0],
      state.coordinates[1]
    )

    BottomBarStore.setState({ info })
  }
}
