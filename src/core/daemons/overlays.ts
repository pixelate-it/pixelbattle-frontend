import createStore, { Listener } from 'unistore'
import { OverlaysState } from './types'
import { config } from 'src/config'
import { LocalStorage } from '../classes/storage/local'
import { blobToString, stringToBlob } from '../classes/storage/util'
import { OverlayImage } from '../classes/primitives/OverlayImage'

export class OverlaysDaemon {
  private static store = createStore<OverlaysState>({
    image: null,
    imageName: null,
    position: null,
    opacity: null,
    currentId: -1
  })

  static addImage(
    imageBlob: Blob,
    imageName: string,
    position: { x: number; y: number }
  ) {
    OverlaysDaemon.setState({
      image: new OverlayImage(imageBlob),
      imageName,
      position,
      currentId: OverlaysDaemon.getState().currentId + 1,
      opacity: config.overlay.defaultOpacity
    })

    OverlaysDaemon.save()
  }

  static remImage() {
    const state = OverlaysDaemon.getState()
    if (state.currentId !== 1) {
      LocalStorage.reset('overlays')
      LocalStorage.reset('currentOverlay')
      OverlaysDaemon.setState({
        image: null,
        currentId: 0
      })
      return
    }

    LocalStorage.set('currentOverlay', state.currentId - 1)
    const overlays = LocalStorage.get('overlays')
    if (overlays)
      LocalStorage.set(
        'overlays',
        overlays.filter((_, i) => i !== state.currentId)
      )
    OverlaysDaemon.load()
  }

  static prevImage() {
    const currentId = LocalStorage.get('currentOverlay')
    if (currentId !== undefined && currentId > 0) {
      LocalStorage.set('currentOverlay', currentId - 1)
      OverlaysDaemon.load()
    }
  }

  static nextImage() {
    const currentId = LocalStorage.get('currentOverlay')
    const overlays = LocalStorage.get('overlays')
    if (
      overlays !== undefined &&
      currentId !== undefined &&
      currentId < overlays.length - 1
    ) {
      LocalStorage.set('currentOverlay', currentId + 1)
      OverlaysDaemon.load()
    }
  }

  static setPosition(position: { x: number; y: number }) {
    OverlaysDaemon.setState({ position })
    OverlaysDaemon.save()
  }

  static setOpacity(opacity: number) {
    OverlaysDaemon.setState({ opacity })
    OverlaysDaemon.save()
  }

  static async save() {
    const overlays = LocalStorage.get('overlays')
    const state = OverlaysDaemon.getState()

    if (!overlays && state.image) {
      LocalStorage.set('overlays', [await OverlaysDaemon.dumpOverlay()])
      LocalStorage.set('currentOverlay', 0)
      return
    }

    if (!overlays) return

    if (state.currentId < overlays.length) {
      for (let i = 0; i < overlays.length; i++)
        if (i === state.currentId) {
          overlays[i] = await OverlaysDaemon.dumpOverlay()
          LocalStorage.set('overlays', overlays)
          LocalStorage.set('currentOverlay', i)
          return
        }
    } else {
      LocalStorage.set('overlays', [
        ...overlays!,
        await OverlaysDaemon.dumpOverlay()
      ])
      LocalStorage.set('currentOverlay', state.currentId)
    }
  }

  static async load() {
    const overlays = LocalStorage.get('overlays')
    const currentId = LocalStorage.get('currentOverlay')
    if (overlays === undefined || currentId === undefined) return
    const currentOverlay = overlays[currentId]

    if (currentOverlay !== undefined) {
      const blob = await stringToBlob(currentOverlay.data)
      OverlaysDaemon.setState({
        image: new OverlayImage(blob),
        position: currentOverlay.position,
        opacity: currentOverlay.opacity,
        imageName: currentOverlay.name,
        currentId: currentId
      })
    }
  }

  private static async dumpOverlay() {
    const state = OverlaysDaemon.getState()
    const overlay = {
      data: await blobToString(state.image!.blob!),
      name: state.imageName!,
      position: state.position!,
      opacity: state.opacity!
    }
    return overlay
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
