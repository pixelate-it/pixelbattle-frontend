import { AppRequests } from 'src/classes/AppRequests'
import { CanvasState } from 'src/types/stores/'
import createStore from 'unistore'

export const CanvasStore = createStore<CanvasState>({
  canvasLoadingException: false,
  pointerCoordinates: [0, 0],
  canvasPrepared: false,
  pixelInfo: null
})

export const BottomBarManager = {
  fetchPixel() {
    const state = CanvasStore.getState()
    if (!state.pointerCoordinates[0] || !state.pointerCoordinates[1]) return

    AppRequests.getPixel(
      state.pointerCoordinates[0],
      state.pointerCoordinates[1]
    )
      .then((pixelInfo) => CanvasStore.setState({ pixelInfo }))
      .catch((e) => console.error(e))
  }
}
