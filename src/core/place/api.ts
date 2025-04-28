import { CooldownDaemon } from '../daemons/cooldown'
import { InfoDaemon } from '../daemons/info'
import { PaletteDaemon } from '../daemons/palette'
import { ProfileDaemon } from '../daemons/profile'
import RequestsDaemon from '../daemons/requests'
import { Viewport } from '../storage'

export class ApiPlace {
  public static putPixel(x: number, y: number) {
    if (CooldownDaemon.state.hasCooldown) {
      return
    }
    if (CooldownDaemon.state === null) {
      return
    }
    const info = InfoDaemon.state
    if (info === null || info.ended) {
      return
    }

    if (ProfileDaemon.state.isBanned) {
      return
    }
    if (!Viewport.checkPointInside(x, y)) return

    CooldownDaemon.preStart()
    RequestsDaemon.putPixel({
      x,
      y,
      color: PaletteDaemon.state.selected.toHex()
    })
      .then(() => CooldownDaemon.start())
      .catch(() => CooldownDaemon.stop())
  }
}
