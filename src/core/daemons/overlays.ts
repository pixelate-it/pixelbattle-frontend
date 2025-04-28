import createStore, { Listener } from 'unistore'
import { OverlayViewMode, OverlaysState } from './types'
import { config } from 'src/config'
import { GuiDaemon } from './gui'
import { LocalStorage } from '../storage/local'
import { Overlay } from '../util/overlay'

/**
 * The daemon is responsible overlays (images to paint) on canvas
 */
export class OverlaysDaemon {
  private static store = createStore<OverlaysState>({
    overlays: [],
    currentOverlay: -1,
    prevOverlayButtonActive: false,
    nextOverlayButtonActive: false,
    viewMode: 0,
    gui: false
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
        // There's we create new overlay, and set's to process image blob
        // Parameters after data, just to store inside Overlay
        // Overlay is empty at create
        await new Overlay().process({
          data: imageBlob,
          name: imageName,
          position,
          opacity: config.overlay.defaultOpacity
        })
      ],
      currentOverlay: OverlaysDaemon.state.currentOverlay + 1
    }

    // And save!
    OverlaysDaemon.saveOverlays()
  }

  /**
   * Set's or reset image of current overlay
   * @param imageBlob Blob of image
   * @param imageName Name of image
   */
  static async setOverlayImage(imageBlob: Blob, imageName: string) {
    const overlays = OverlaysDaemon.state.overlays
    const currentImage = overlays[OverlaysDaemon.state.currentOverlay]
    // Set's to process new image
    await overlays[OverlaysDaemon.state.currentOverlay].process({
      data: imageBlob,
      name: imageName,
      position: { x: currentImage.x, y: currentImage.y },
      opacity: currentImage.opacity
    })
    // By setter, we can just set it to state
    OverlaysDaemon.state = { overlays }
    // And save!
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

    // If items count inside overlays total 1, just clear overlays from localStorage and state
    if (overlays.length === 1) {
      LocalStorage.reset('overlays')
      LocalStorage.reset('currentOverlay')
      OverlaysDaemon.state = {
        overlays: [],
        currentOverlay: -1
      }
      return
    }

    // It's code just returns id of overlay to delete, it's returns previous id
    // But if we at first overlay, we can't get previous id
    // And it just returns current id
    const currentOverlay =
      state.currentOverlay === 0
        ? state.currentOverlay
        : state.currentOverlay - 1

    // "Why not saveOverlays?" cuz saveOverlays dumps image at glob format, and it very expensive process
    LocalStorage.set('currentOverlay', currentOverlay)
    LocalStorage.set(
      'overlays',
      overlays.filter((_, i) => i !== state.currentOverlay)
    )
    // And just filter overlays, for delete overlay which we have chosen to delete
    OverlaysDaemon.state = {
      overlays: state.overlays.filter((_, i) => i !== state.currentOverlay),
      currentOverlay
    }
  }

  /**
   * Change current overlay to previous
   * Uses inside <Overlays /> for manage overlays
   */
  static prevOverlay() {
    const currentOverlay = LocalStorage.get('currentOverlay')
    if (currentOverlay !== undefined)
      if (currentOverlay > 0)
        OverlaysDaemon.setCurrentOverlayId(currentOverlay - 1)
      else
        OverlaysDaemon.setCurrentOverlayId(
          OverlaysDaemon.state.overlays.length - 1
        )
  }

  /**
   * Change current overlay to next
   * Uses inside <Overlays /> for manage overlays
   */
  static nextOverlay() {
    const currentOverlay = LocalStorage.get('currentOverlay')
    const overlays = LocalStorage.get('overlays')
    if (overlays !== undefined && currentOverlay !== undefined)
      if (currentOverlay < overlays.length - 1)
        OverlaysDaemon.setCurrentOverlayId(currentOverlay + 1)
      else OverlaysDaemon.setCurrentOverlayId(0)
  }

  /**
   * Changes view mode of overlays.
   * View modes is only 3 types: nothing to draw, only current overlay, and all overlays
   * Aaand it uses inside <Overlays /> for manage modes
   */
  static nextViewMode() {
    const oldMode = OverlaysDaemon.state.viewMode
    const mode = oldMode + 1 === 3 ? 0 : oldMode + 1
    OverlaysDaemon.state = { viewMode: mode as OverlayViewMode }
    LocalStorage.set('overlayViewMode', mode)
  }

  /**
   * Not implemented function, that changes overlay name.
   * Just for manage overlays.
   * Not uses.
   * @param name Name of overlay
   */
  static setOverlayName(name: string) {
    const state = OverlaysDaemon.state
    state.overlays[state.currentOverlay].imageName = name
    OverlaysDaemon.state = { overlays: state.overlays }
    OverlaysDaemon.saveOverlays()
  }

  /**
   * Changes overlay position
   * Uses in <Overlays /> and overlaysPlugin
   * @param x New x position
   * @param y New x position
   */
  static setOverlayPosition(x: number, y: number) {
    const state = OverlaysDaemon.state
    state.overlays[state.currentOverlay].x = x
    state.overlays[state.currentOverlay].y = y
    OverlaysDaemon.state = { overlays: state.overlays }
    OverlaysDaemon.saveOverlays()
  }

  /**
   * Changes overlay opacity
   * Uses in <Overlays />
   * @param opacity New opacity
   */
  static setOverlayOpacity(opacity: number) {
    const state = OverlaysDaemon.state
    state.overlays[state.currentOverlay].opacity = opacity
    OverlaysDaemon.state = { overlays: state.overlays }
    OverlaysDaemon.saveOverlays()
  }

  /**
   * Toggles gui for overlay.
   * @param value
   */
  static toggleOverlayGui(gui: boolean = !OverlaysDaemon.state.gui) {
    OverlaysDaemon.state = { gui }
    GuiDaemon.setCurrent(gui ? 0 : null)
  }

  /**
   * Set's current overlay by id
   * @param id Id of overlay
   */
  private static setCurrentOverlayId(id: number) {
    const state = OverlaysDaemon.state
    LocalStorage.set('currentOverlay', id)
    OverlaysDaemon.state = {
      currentOverlay: id,
      prevOverlayButtonActive: id > 0,
      nextOverlayButtonActive: id < state.overlays.length - 1
    }
  }

  /**
   * Saves all overlays in localStorage
   */
  private static async saveOverlays() {
    const overlays = LocalStorage.get('overlays')
    const state = OverlaysDaemon.state

    // If overlays in storage is previous not initialization
    if (!overlays && state.overlays[state.currentOverlay]) {
      LocalStorage.set('overlays', [
        // Dump returns array of glob like images (or just links to images, in data+ format)
        state.overlays[state.currentOverlay].dump()
      ])
      LocalStorage.set('currentOverlay', 0)
      return
    }

    // If overlays from localStorage is empty, we just end execution
    if (!overlays) return

    // Variables for ui, just for blocking not working buttons
    OverlaysDaemon.state = {
      prevOverlayButtonActive: state.currentOverlay > 0,
      nextOverlayButtonActive: state.currentOverlay < overlays.length - 1
    }

    // Here we stores all images from overlays and current overlay id
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
      // Process overlays from data, stored inside localStorage
      for (const i in overlays)
        overlaysArray.push(await new Overlay().process(overlays[i]))
      // And set other information inside state
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

  static get guiEnabled() {
    return OverlaysDaemon.state.gui
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

  /**
   * Subscribe to updates of this daemon
   * @param f Event listener
   */
  static on(f: Listener<OverlaysState>) {
    OverlaysDaemon.store.subscribe(f)
  }

  /**
   * Unsubscribe to updates of this daemon
   * @param f Event listener
   */
  static off(f: Listener<OverlaysState>) {
    OverlaysDaemon.store.unsubscribe(f)
  }
}
