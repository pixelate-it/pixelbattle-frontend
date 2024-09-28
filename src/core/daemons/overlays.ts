import createStore, { Listener } from 'unistore'
import { OverlaysState } from './types'
import { config } from 'src/config'
import { LocalStorage } from '../classes/storage/local'
import { OverlayImage } from '../classes/primitives/OverlayImage'

export class OverlaysDaemon {
  private static store = createStore<OverlaysState>({
    images: [],
    currentId: -1,
    prevActive: false,
    nextActive: false,
    mode: 0
  })

  static get image(): OverlayImage | undefined {
    const s = OverlaysDaemon.getState()
    return s.images[s.currentId]
  }

  static get images(): Array<OverlayImage> {
    const s = OverlaysDaemon.getState()
    return s.images
  }

  static get mode(): 0 | 1 | 2 {
    const s = OverlaysDaemon.getState()
    return s.mode
  }

  static async addImage(
    imageBlob: Blob,
    imageName: string,
    position: { x: number; y: number }
  ) {
    OverlaysDaemon.setState({
      images: [
        ...OverlaysDaemon.getState().images,
        await new OverlayImage().process({
          data: imageBlob,
          name: imageName,
          position,
          opacity: config.overlay.defaultOpacity
        })
      ],
      currentId: OverlaysDaemon.getState().currentId + 1
    })

    OverlaysDaemon.save()
  }

  static remImage() {
    const state = OverlaysDaemon.getState()
    const overlays = LocalStorage.get('overlays')

    if (!overlays) return

    if (overlays.length === 1) {
      LocalStorage.reset('overlays')
      LocalStorage.reset('currentOverlay')
      OverlaysDaemon.setState({
        images: [],
        currentId: 0
      })
      return
    }

    const currentId =
      overlays.length === 2 && state.currentId === 0
        ? state.currentId
        : state.currentId - 1

    LocalStorage.set('currentOverlay', currentId)
    LocalStorage.set(
      'overlays',
      overlays.filter((_, i) => i !== state.currentId)
    )
    OverlaysDaemon.setState({
      images: state.images.filter((_, i) => i !== state.currentId),
      currentId
    })
  }

  static prevImage() {
    const currentId = LocalStorage.get('currentOverlay')
    const state = OverlaysDaemon.getState()
    if (currentId !== undefined && currentId > 0) {
      LocalStorage.set('currentOverlay', currentId - 1)
      OverlaysDaemon.setState({
        currentId: currentId - 1,
        prevActive: currentId - 1 > 0,
        nextActive: currentId - 1 < state.images.length - 1
      })
    }
  }

  static nextImage() {
    const currentId = LocalStorage.get('currentOverlay')
    const overlays = LocalStorage.get('overlays')
    const state = OverlaysDaemon.getState()
    if (
      overlays !== undefined &&
      currentId !== undefined &&
      currentId < overlays.length - 1
    ) {
      LocalStorage.set('currentOverlay', currentId + 1)
      OverlaysDaemon.setState({
        currentId: currentId + 1,
        prevActive: currentId + 1 > 0,
        nextActive: currentId + 1 < state.images.length - 1
      })
    }
  }

  static nextMode() {
    const oldMode = OverlaysDaemon.getState().mode
    const mode = oldMode + 1 === 3 ? 0 : oldMode + 1
    OverlaysDaemon.setState({ mode })
    LocalStorage.set('overlayMode', mode)
  }

  static getAllOverlays() {}

  static setPosition(x: number, y: number) {
    const state = OverlaysDaemon.getState()
    state.images[state.currentId].x = x
    state.images[state.currentId].y = y
    OverlaysDaemon.setState({ images: state.images })
    OverlaysDaemon.save()
  }

  static setOpacity(opacity: number) {
    const state = OverlaysDaemon.getState()
    state.images[state.currentId].opacity = opacity
    OverlaysDaemon.setState({ images: state.images })
    OverlaysDaemon.save()
  }

  static async save() {
    const overlays = LocalStorage.get('overlays')
    const state = OverlaysDaemon.getState()

    if (!overlays && state.images[state.currentId]) {
      LocalStorage.set('overlays', [state.images[state.currentId].dump()])
      LocalStorage.set('currentOverlay', 0)
      return
    }

    if (!overlays) return

    OverlaysDaemon.setState({
      prevActive: state.currentId > 0,
      nextActive: state.currentId < overlays.length - 1
    })

    LocalStorage.set(
      'overlays',
      state.images.map((v) => v.dump())
    )
    LocalStorage.set('currentOverlay', state.currentId)
  }

  static async load() {
    const overlays = LocalStorage.get('overlays')
    const currentId = LocalStorage.get('currentOverlay')
    if (overlays === undefined || currentId === undefined) return
    const currentOverlay = overlays[currentId]

    if (currentOverlay !== undefined) {
      const images: Array<OverlayImage> = []
      for (const i in overlays)
        images.push(await new OverlayImage().process(overlays[i]))
      OverlaysDaemon.setState({
        images: images,
        currentId: currentId,
        prevActive: currentId > 0,
        nextActive: currentId < overlays.length - 1,
        mode: LocalStorage.get('overlayMode') ?? 0
      })
    }
  }

  private static setState(state: Partial<OverlaysState>) {
    OverlaysDaemon.store.setState(
      state as Pick<OverlaysState, keyof OverlaysState>
    )
  }

  static getState(): OverlaysState {
    return OverlaysDaemon.store.getState()
  }

  static on(f: Listener<OverlaysState>) {
    OverlaysDaemon.store.subscribe(f)
  }

  static off(f: Listener<OverlaysState>) {
    OverlaysDaemon.store.unsubscribe(f)
  }
}
