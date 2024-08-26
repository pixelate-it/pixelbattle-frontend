import { useEffect, useState } from 'preact/hooks'
import { PaletteStore } from 'src/managers/palette'
import { PaletteState } from 'src/types/managers'
import { arraysEqual } from './useStore'

export const usePalette = (): PaletteState => {
  const [state, setState] = useState(PaletteStore.getState())

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

    PaletteStore.subscribe(sub)

    return () => {
      PaletteStore.unsubscribe(sub)
    }
  }, [])

  return state
}
