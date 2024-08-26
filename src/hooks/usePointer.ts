import { useEffect, useState } from 'preact/hooks'
import { PointerManager, PointerStore } from 'src/managers/pointer'
import { PointerState } from 'src/types/managers'
import { arraysEqual } from './useStore'
import { AppConfig } from 'src/classes/AppConfig'

export const usePointer = (): PointerState => {
  const [state, setState] = useState(PointerStore.getState())

  useEffect(() => {
    let oldState = state
    let timerId: NodeJS.Timeout | null = null
    const sub = (state: PointerState) => {
      if (!arraysEqual(oldState.coordinates, state.coordinates)) {
        if (timerId !== null) {
          clearTimeout(timerId)
        }
        timerId = setTimeout(() => {
          PointerManager.fetchPixel()
          timerId = null
        }, AppConfig.time.pixelInfo)
      }

      if (
        !arraysEqual(oldState.coordinates, state.coordinates) ||
        !Object.is(oldState.info, state.info) ||
        oldState.empty !== state.empty
      )
        setState(state)
      oldState = state
    }

    PointerStore.subscribe(sub)

    return () => {
      PointerStore.unsubscribe(sub)
      if (timerId !== null) {
        clearTimeout(timerId)
      }
    }
  }, [])

  return state
}
