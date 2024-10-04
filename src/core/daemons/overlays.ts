import createStore, { Listener } from 'unistore'
import { BruhOverlayMode, OverlaysState } from './types'
import { config } from 'src/config'
import { LocalStorage } from '../classes/storage/local'
import { OverlayImage } from '../classes/primitives/OverlayImage'

export class OverlaysDaemon {
  private static store = createStore<OverlaysState>({
    images: [],
    currentId: -1,
    prevActive: false,
    nextActive: false,
    mode: 0,
    editing: false
  })

  static get image(): OverlayImage | undefined {
    const s = OverlaysDaemon.state
    return s.images[s.currentId]
  }

  static get state(): OverlaysState {
    return OverlaysDaemon.store.getState()
  }

  static async setImage(imageBlob: Blob, imageName: string) {
    const images = OverlaysDaemon.state.images
    const currentImage = images[OverlaysDaemon.state.currentId]
    await images[OverlaysDaemon.state.currentId].process({
      data: imageBlob,
      name: imageName,
      position: { x: currentImage.x, y: currentImage.y },
      opacity: currentImage.opacity
    })
    OverlaysDaemon.setState({ images })
    OverlaysDaemon.save()
  }

  static async addImage(
    imageBlob: Blob,
    imageName: string,
    position: { x: number; y: number }
  ) {
    OverlaysDaemon.setState({
      images: [
        ...OverlaysDaemon.state.images,
        await new OverlayImage().process({
          data: imageBlob,
          name: imageName,
          position,
          opacity: config.overlay.defaultOpacity
        })
      ],
      currentId: OverlaysDaemon.state.currentId + 1
    })

    OverlaysDaemon.save()
  }

  static remImage() {
    const state = OverlaysDaemon.state
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
    if (currentId !== undefined && currentId > 0)
      OverlaysDaemon.setCurrentId(currentId - 1)
  }

  static nextImage() {
    const currentId = LocalStorage.get('currentOverlay')
    const overlays = LocalStorage.get('overlays')
    if (
      overlays !== undefined &&
      currentId !== undefined &&
      currentId < overlays.length - 1
    )
      OverlaysDaemon.setCurrentId(currentId + 1)
  }

  static nextMode() {
    const oldMode = OverlaysDaemon.state.mode
    const mode = oldMode + 1 === 3 ? 0 : oldMode + 1
    OverlaysDaemon.setState({ mode: mode as BruhOverlayMode })
    LocalStorage.set('overlayMode', mode)
  }

  static setName(name: string) {
    const state = OverlaysDaemon.state
    state.images[state.currentId].imageName = name
    OverlaysDaemon.setState({ images: state.images })
    OverlaysDaemon.save()
  }

  static setPosition(x: number, y: number) {
    const state = OverlaysDaemon.state
    state.images[state.currentId].x = x
    state.images[state.currentId].y = y
    OverlaysDaemon.setState({ images: state.images })
    OverlaysDaemon.save()
  }

  static setOpacity(opacity: number) {
    const state = OverlaysDaemon.state
    state.images[state.currentId].opacity = opacity
    OverlaysDaemon.setState({ images: state.images })
    OverlaysDaemon.save()
  }

  static setEditing(editing: boolean) {
    OverlaysDaemon.setState({ editing })
  }

  private static setCurrentId(id: number) {
    const state = OverlaysDaemon.state
    LocalStorage.set('currentOverlay', id)
    OverlaysDaemon.setState({
      currentId: id,
      prevActive: id > 0,
      nextActive: id < state.images.length - 1
    })
  }

  private static async save() {
    const overlays = LocalStorage.get('overlays')
    const state = OverlaysDaemon.state

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
        mode: (LocalStorage.get('overlayMode') ?? 0) as BruhOverlayMode
      })
    }
  }

  private static setState(state: Partial<OverlaysState>) {
    OverlaysDaemon.store.setState(
      state as Pick<OverlaysState, keyof OverlaysState>
    )
  }

  static on(f: Listener<OverlaysState>) {
    OverlaysDaemon.store.subscribe(f)
  }

  static off(f: Listener<OverlaysState>) {
    OverlaysDaemon.store.unsubscribe(f)
  }
}
