import { useEffect, useRef, useState } from 'preact/hooks'
import { PaletteDaemon } from 'src/core/daemons/palette'
import { PaletteState } from 'src/core/daemons/types'

export const useColorDelete = () => {
  const touchTimerRef = useRef<NodeJS.Timeout>()
  const [disabled, setDisabled] = useState<boolean>(true)

  function onClickStart(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    if (!PaletteDaemon.isDefaultColors()) {
      touchTimerRef.current = setTimeout(() => {
        PaletteDaemon.reset()
      }, 500)
      setDisabled(false)
    }
  }

  function onClickEnd(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    if (event.shiftKey) {
      PaletteDaemon.reset()
      return
    }
    if (!PaletteDaemon.isDefaultColor(PaletteDaemon.state.selected)) {
      PaletteDaemon.removeColor(PaletteDaemon.state.selected)
    }
    setDisabled(true)
  }

  function onClickCancel(event: MouseEvent | TouchEvent) {
    event.preventDefault()
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current)
    setDisabled(true)
  }

  useEffect(() => {
    const check = (state: PaletteState) => {
      setDisabled(PaletteDaemon.isDefaultColor(state.selected))
    }
    PaletteDaemon.on(check)
    return () => {
      PaletteDaemon.off(check)
    }
  }, [])

  return { disabled, onClickStart, onClickEnd, onClickCancel }
}
