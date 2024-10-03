import { useState } from 'preact/hooks'
import Color from 'src/core/classes/primitives/Color'
import { PaletteDaemon } from 'src/core/daemons/palette'

export const useColorCreate = () => {
  const [color, setColor] = useState(PaletteDaemon.state.selected.toHex())
  const [open, setOpen] = useState(false)

  function onSelect() {
    setOpen(!open)

    PaletteDaemon.addAndSelect(new Color(color))
  }

  function toggle() {
    setOpen(!open)
  }

  function openPicker() {
    setColor(PaletteDaemon.state.selected.toHex())

    toggle()
  }

  return { openPicker, onSelect, open, toggle, color, setColor }
}
