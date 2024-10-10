import createStore, { Listener } from 'unistore'
import { ToolsState } from './types'

export class ToolsDaemon {
  private static store = createStore<ToolsState>({
    pickerIsEnabled: false,
    lockedPaletteGrowing: false
  })

  static togglePicker() {
    ToolsDaemon.setState({
      pickerIsEnabled: !ToolsDaemon.state.pickerIsEnabled
    })
  }
  static toggleLock() {
    ToolsDaemon.setState({
      lockedPaletteGrowing: !ToolsDaemon.state.lockedPaletteGrowing
    })
  }

  private static setState(state: Partial<ToolsState>) {
    ToolsDaemon.store.setState(state as Pick<ToolsState, keyof ToolsState>)
  }

  static get state(): ToolsState {
    return ToolsDaemon.store.getState()
  }

  static on(f: Listener<ToolsState>) {
    ToolsDaemon.store.subscribe(f)
  }

  static off(f: Listener<ToolsState>) {
    ToolsDaemon.store.unsubscribe(f)
  }
}
