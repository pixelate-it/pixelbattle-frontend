import { useEffect, useState } from 'preact/hooks'
import { arraysEqual } from '../util/useDaemon'
import { PaletteDaemon } from 'src/core/daemons/palette'
import { PaletteState } from 'src/core/daemons/types'

export const usePalette = (): PaletteState => {
  const [state, setState] = useState(PaletteDaemon.state)

  useEffect(() => {
    let oldState = state

    const sub = (newState: typeof state) => {
      if (
        newState.colors.length !== oldState.colors.length ||
        !arraysEqual(newState.selected.color, oldState.selected.color)
      )
        setState(newState)
      oldState = newState
    }

    PaletteDaemon.on(sub)

    return () => {
      PaletteDaemon.off(sub)
    }
  }, [])

  return state
}
