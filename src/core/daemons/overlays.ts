import createStore, { Listener } from 'unistore'
import { OverlayViewMode, OverlaysState } from './types'
import { config } from 'src/config'
import { LocalStorage } from '../classes/storage/local'
import { Overlay } from '../classes/primitives/Overlay'

export class OverlaysDaemon {
  private static store = createStore<OverlaysState>({
    overlays: [],
    currentOverlay: -1,
    prevOverlayButtonActive: false,
    nextOverlayButtonActive: false,
    viewMode: 0,
    editingMode: false
  })

  /**
   * Adds overlay to list
   * @param imageBlob Blob of image
   * @param imageName Name of image
   * @param position Position
   */
  static async addOverlay(
    imageBlob: Blob,
    imageName: string,
    position: { x: number; y: number }
  ) {
    OverlaysDaemon.state = {
      overlays: [
        ...OverlaysDaemon.state.overlays,
        await new Overlay().process({
          data: imageBlob,
          name: imageName,
          position,
          opacity: config.overlay.defaultOpacity
        })
      ],
      currentOverlay: OverlaysDaemon.state.currentOverlay + 1
    }

    OverlaysDaemon.saveOverlays()
  }

  /**
   * Sets to current overlay image
   * @param imageBlob Blob of image
   * @param imageName Name of image
   */
  static async setOverlayImage(imageBlob: Blob, imageName: string) {
    const overlays = OverlaysDaemon.state.overlays
    const currentImage = overlays[OverlaysDaemon.state.currentOverlay]
    await overlays[OverlaysDaemon.state.currentOverlay].process({
      data: imageBlob,
      name: imageName,
      position: { x: currentImage.x, y: currentImage.y },
      opacity: currentImage.opacity
    })
    OverlaysDaemon.state = { overlays }
    OverlaysDaemon.saveOverlays()
  }

  /**
   * Remove current overlay
   * @returns nothing
   */
  static removeCurrentOverlay() {
    const state = OverlaysDaemon.state
    const overlays = LocalStorage.get('overlays')

    if (!overlays) return

    if (overlays.length === 1) {
      LocalStorage.reset('overlays')
      LocalStorage.reset('currentOverlay')
      OverlaysDaemon.state = {
        overlays: [],
        currentOverlay: -1
      }
      return
    }

    const currentOverlay =
      overlays.length === 2 && state.currentOverlay === 0
        ? state.currentOverlay
        : state.currentOverlay - 1

    LocalStorage.set('currentOverlay', currentOverlay)
    LocalStorage.set(
      'overlays',
      overlays.filter((_, i) => i !== state.currentOverlay)
    )
    OverlaysDaemon.state = {
      overlays: state.overlays.filter((_, i) => i !== state.currentOverlay),
      currentOverlay
    }
  }

  static prevOverlay() {
    const currentOverlay = LocalStorage.get('currentOverlay')
    if (currentOverlay !== undefined && currentOverlay > 0)
      OverlaysDaemon.setCurrentOverlayId(currentOverlay - 1)
  }

  static nextOverlay() {
    const currentOverlay = LocalStorage.get('currentOverlay')
    const overlays = LocalStorage.get('overlays')
    if (
      overlays !== undefined &&
      currentOverlay !== undefined &&
      currentOverlay < overlays.length - 1
    )
      OverlaysDaemon.setCurrentOverlayId(currentOverlay + 1)
  }

  static nextViewMode() {
    const oldMode = OverlaysDaemon.state.viewMode
    const mode = oldMode + 1 === 3 ? 0 : oldMode + 1
    OverlaysDaemon.state = { viewMode: mode as OverlayViewMode }
    LocalStorage.set('overlayViewMode', mode)
  }

  static setOverlayName(name: string) {
    const state = OverlaysDaemon.state
    state.overlays[state.currentOverlay].imageName = name
    OverlaysDaemon.state = { overlays: state.overlays }
    OverlaysDaemon.saveOverlays()
  }

  static setOverlayPosition(x: number, y: number) {
    const state = OverlaysDaemon.state
    state.overlays[state.currentOverlay].x = x
    state.overlays[state.currentOverlay].y = y
    OverlaysDaemon.state = { overlays: state.overlays }
    OverlaysDaemon.saveOverlays()
  }

  static setOverlayOpacity(opacity: number) {
    const state = OverlaysDaemon.state
    state.overlays[state.currentOverlay].opacity = opacity
    OverlaysDaemon.state = { overlays: state.overlays }
    OverlaysDaemon.saveOverlays()
  }

  static setOverlayEditingMode(editingMode: boolean) {
    OverlaysDaemon.state = { editingMode }
  }

  private static setCurrentOverlayId(id: number) {
    const state = OverlaysDaemon.state
    LocalStorage.set('currentOverlay', id)
    OverlaysDaemon.state = {
      currentOverlay: id,
      prevOverlayButtonActive: id > 0,
      nextOverlayButtonActive: id < state.overlays.length - 1
    }
  }

  private static async saveOverlays() {
    const overlays = LocalStorage.get('overlays')
    const state = OverlaysDaemon.state

    if (!overlays && state.overlays[state.currentOverlay]) {
      LocalStorage.set('overlays', [
        state.overlays[state.currentOverlay].dump()
      ])
      LocalStorage.set('currentOverlay', 0)
      return
    }

    if (!overlays) return

    OverlaysDaemon.state = {
      prevOverlayButtonActive: state.currentOverlay > 0,
      nextOverlayButtonActive: state.currentOverlay < overlays.length - 1
    }

    LocalStorage.set(
      'overlays',
      state.overlays.map((v) => v.dump())
    )
    LocalStorage.set('currentOverlay', state.currentOverlay)
  }

  static async loadOverlays() {
    const overlays = LocalStorage.get('overlays')
    const currentId = LocalStorage.get('currentOverlay')
    if (overlays === undefined || currentId === undefined) return
    const currentOverlay = overlays[currentId]

    if (currentOverlay !== undefined) {
      const overlaysArray: Array<Overlay> = []
      for (const i in overlays)
        overlaysArray.push(await new Overlay().process(overlays[i]))
      OverlaysDaemon.state = {
        overlays: overlaysArray,
        currentOverlay: currentId,
        prevOverlayButtonActive: currentId > 0,
        nextOverlayButtonActive: currentId < overlays.length - 1,
        viewMode: (LocalStorage.get('overlayViewMode') ?? 0) as OverlayViewMode
      }
    }
  }

  private static set state(state: Partial<OverlaysState>) {
    OverlaysDaemon.store.setState(
      state as Pick<OverlaysState, keyof OverlaysState>
    )
  }

  static get empty(): boolean {
    const s = OverlaysDaemon.state
    return s.currentOverlay === -1 || s.overlays.length - 1 < s.currentOverlay
  }

  static get currentOverlay(): Overlay {
    const s = OverlaysDaemon.state
    return s.overlays[s.currentOverlay]
  }

  static get state(): OverlaysState {
    return OverlaysDaemon.store.getState()
  }

  static on(f: Listener<OverlaysState>) {
    OverlaysDaemon.store.subscribe(f)
  }

  static off(f: Listener<OverlaysState>) {
    OverlaysDaemon.store.unsubscribe(f)
  }
}
