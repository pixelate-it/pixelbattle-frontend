import { useEffect, useState } from 'preact/hooks'
import { arraysEqual } from './util/useDaemon'
import { PointerDaemon } from 'src/core/daemons/pointer'
import { PointerState } from 'src/core/daemons/types'
import { config } from 'src/config'

export const usePointer = (): PointerState => {
  const [state, setState] = useState(PointerDaemon.getState())

  useEffect(() => {
    let oldState = state
    let timerId: NodeJS.Timeout | null = null
    const sub = (state: PointerState) => {
      if (!arraysEqual(oldState.coordinates, state.coordinates)) {
        if (timerId !== null) {
          clearTimeout(timerId)
        }
        timerId = setTimeout(() => {
          PointerDaemon.fetchPixel()
          timerId = null
        }, config.time.pixelInfo)
      }

      if (
        !arraysEqual(oldState.coordinates, state.coordinates) ||
        !Object.is(oldState.info, state.info) ||
        oldState.empty !== state.empty
      )
        setState(state)
      oldState = state
    }

    PointerDaemon.on(sub)

    return () => {
      PointerDaemon.off(sub)
      if (timerId !== null) {
        clearTimeout(timerId)
      }
    }
  }, [])

  return state
}
