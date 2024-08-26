import { PickerState } from 'src/types/managers'
import createStore from 'unistore'

export const PickerStore = createStore<PickerState>({
  isEnabled: false
})

export const PickerManager = {
  toggle() {
    PickerStore.setState({ isEnabled: !PickerStore.getState().isEnabled })
  }
}
