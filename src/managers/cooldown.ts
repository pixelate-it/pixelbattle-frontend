import { AppConfig } from 'src/classes/AppConfig'
import { CooldownState } from 'src/types/managers'
import createStore from 'unistore'
import { ComputedProfileStore } from './profile'
import { InfoStore } from './info'

export const CooldownStore = createStore<CooldownState>({
  startRequestTime: 0,
  progress: 0,
  reqId: 0,
  startTime: 0,
  hasCooldown: false
})

export const CooldownManager = {
  preStart() {
    CooldownStore.setState({
      hasCooldown: true,
      startRequestTime: Date.now()
    })
  },
  start() {
    CooldownStore.setState({
      startTime: performance.now(),
      reqId: requestAnimationFrame(this.update)
    })
  },
  update(time: number) {
    const cooldown = CooldownStore.getState()
    const info = InfoStore.getState()
    const profile = ComputedProfileStore.getState()
    if (!info) return

    const currentTime = time - cooldown.startTime
    const differenceOfTime = cooldown.startRequestTime - Date.now()

    const cooldownDuration =
      AppConfig.cooldown.offset +
      (profile.isStaff ? AppConfig.cooldown.staff : info.cooldown) -
      differenceOfTime / 2

    const progress = currentTime / cooldownDuration

    if (progress >= 1) {
      CooldownStore.setState({ progress: 0, hasCooldown: false })
      cancelAnimationFrame(cooldown.reqId)
      return
    }

    CooldownStore.setState({ progress: progress * 100 })

    requestAnimationFrame(CooldownManager.update)
  }
}
