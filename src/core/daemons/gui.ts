import createStore, { Listener } from 'unistore'
import { GuiState } from './types'
import { GuiContainer } from '../place/gui/container'
import { BasicGuiElement } from '../place/gui/basic'
import { Vector } from '../util/vector'

export class GuiDaemon {
  private static store = createStore<GuiState>({
    containers: [],
    current: null
  })

  static getContainerIdAt(pos: Vector) {
    const state = GuiDaemon.state
    for (let f = 0; f < state.containers.length; f++) {
      const i = state.containers[f]
      if (i.isPointerInside(pos)) return f
    }
    return 0
  }

  static unPressElements() {
    if (GuiDaemon.state.current === null) return
    let containers = GuiDaemon.state.containers
    containers[GuiDaemon.state.current].unPressElements()
    GuiDaemon.setState({ containers })
  }

  static updateElement(i: number, element: BasicGuiElement) {
    if (GuiDaemon.state.current === null) return
    let containers = GuiDaemon.state.containers
    containers[GuiDaemon.state.current].updateElement(i, element)
    GuiDaemon.setState({ containers })
  }

  static setCurrent(current: number | null) {
    if (current === null) GuiDaemon.setState({ current })
    else if (current < GuiDaemon.state.containers.length && current >= 0) {
      GuiDaemon.setState({ current })
    }
  }

  static addContainers(...args: Array<GuiContainer>) {
    GuiDaemon.setState({
      containers: [...GuiDaemon.state.containers, ...args]
    })
  }

  static get container(): GuiContainer | undefined {
    return GuiDaemon.state.current !== null
      ? GuiDaemon.state.containers[GuiDaemon.state.current]
      : undefined
  }

  private static setState(state: Partial<GuiState>) {
    GuiDaemon.store.setState(state as Pick<GuiState, keyof GuiState>)
  }

  static get state(): GuiState {
    return GuiDaemon.store.getState()
  }

  static on(f: Listener<GuiState>) {
    GuiDaemon.store.subscribe(f)
  }

  static off(f: Listener<GuiState>) {
    GuiDaemon.store.unsubscribe(f)
  }
}
