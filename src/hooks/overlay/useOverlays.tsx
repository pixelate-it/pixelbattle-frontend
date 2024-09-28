import { OverlaysDaemon } from 'src/core/daemons/overlays'
import { useDaemon } from '../util/useDaemon'

export const useOverlays = () => {
  const overlay = useDaemon(OverlaysDaemon)

  function nextMode() {
    OverlaysDaemon.nextMode()
  }

  return { overlay, nextMode }
}
