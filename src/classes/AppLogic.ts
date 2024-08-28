import { CooldownManager, CooldownStore } from 'src/managers/cooldown'
import { InfoStore } from 'src/managers/info'
import { ComputedProfileStore, ProfileStore } from 'src/managers/profile'
import { AppRequests } from './AppRequests'
import { PaletteStore } from 'src/managers/palette'

export class AppLogic {
  static putPixel(x: number, y: number) {
    if (CooldownStore.getState().hasCooldown) {
      return
    }
    if (ProfileStore.getState() === null) {
      return
    }
    const info = InfoStore.getState()
    if (info === null || info.ended) {
      return
    }

    if (ComputedProfileStore.getState().isBanned) {
      return
    }

    CooldownManager.preStart()
    AppRequests.putPixel({
      x,
      y,
      color: PaletteStore.getState().selected.toHex()
    }).then(() => CooldownManager.start())
  }
}
