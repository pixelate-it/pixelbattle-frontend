import ApiRequest from '../classes/api/request'
import { CooldownDaemon } from '../daemons/cooldown'
import { InfoDaemon } from '../daemons/info'
import { PaletteDaemon } from '../daemons/palette'
import { ProfileDaemon } from '../daemons/profile'

export class ApiPlace {
  public static putPixel(x: number, y: number) {
    if (CooldownDaemon.getState().hasCooldown) {
      return
    }
    if (CooldownDaemon.getState() === null) {
      return
    }
    const info = InfoDaemon.getState()
    if (info === null || info.ended) {
      return
    }

    if (ProfileDaemon.getState().isBanned) {
      return
    }

    CooldownDaemon.preStart()
    ApiRequest.putPixel({
      x,
      y,
      color: PaletteDaemon.getState().selected.toHex()
    }).then(() => CooldownDaemon.start())
  }
}
