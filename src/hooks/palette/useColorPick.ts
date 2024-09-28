import { ToolsDaemon } from 'src/core/daemons/tools'
import { useDaemonSelector } from '../util/useDaemonSelector'
import { ToolsState } from 'src/core/daemons/types'

export const useColorPick = () => {
  const { pickerIsEnabled } = useDaemonSelector<
    ToolsState,
    { pickerIsEnabled: boolean }
  >(ToolsDaemon, ['pickerIsEnabled'])

  return { pickerIsEnabled, toggle: () => ToolsDaemon.togglePicker() }
}
