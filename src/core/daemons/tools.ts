import createStore, { Listener } from 'unistore'
import { ToolsState } from './types'

export class ToolsDaemon {
  private static store = createStore<ToolsState>({
    pickerIsEnabled: false
  })

  static togglePicker() {
    ToolsDaemon.setState({
      pickerIsEnabled: !ToolsDaemon.getState().pickerIsEnabled
    })
  }

  private static setState(state: Partial<ToolsState>) {
    ToolsDaemon.store.setState(state as Pick<ToolsState, keyof ToolsState>)
  }

  static getState(): ToolsState {
    return ToolsDaemon.store.getState()
  }

  static on(f: Listener<ToolsState>) {
    ToolsDaemon.store.subscribe(f)
  }

  static off(f: Listener<ToolsState>) {
    ToolsDaemon.store.unsubscribe(f)
  }
}
