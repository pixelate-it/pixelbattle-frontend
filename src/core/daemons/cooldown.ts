import createStore, { Listener } from 'unistore'
import { InfoDaemon } from './info'
import { CooldownState } from './types'
import { config } from 'src/config'
import { ProfileDaemon } from './profile'

export class CooldownDaemon {
  private static store = createStore<CooldownState>({
    startRequestTime: 0,
    progress: 0,
    reqId: 0,
    startTime: 0,
    hasCooldown: false
  })

  static preStart() {
    CooldownDaemon.setState({
      hasCooldown: true,
      startRequestTime: performance.now()
    })
  }

  static stop() {
    CooldownDaemon.setState({
      hasCooldown: false
    })
  }

  static start() {
    CooldownDaemon.setState({
      startTime: performance.now(),
      reqId: requestAnimationFrame(CooldownDaemon.update)
    })
  }

  private static update(time: number) {
    const cooldown = CooldownDaemon.state
    const info = InfoDaemon.state
    const profile = ProfileDaemon.state
    if (!info) return

    const currentTime = time - cooldown.startTime
    const differenceOfTime = cooldown.startTime - cooldown.startRequestTime

    const cooldownDuration =
      config.cooldown.offset +
      (profile.isStaff ? config.cooldown.staff : info.cooldown)

    const adjustedDuration = Math.max(1, cooldownDuration - differenceOfTime)

    const progress = currentTime / adjustedDuration

    if (progress >= 1) {
      CooldownDaemon.setState({ progress: 0, hasCooldown: false })
      cancelAnimationFrame(cooldown.reqId)
      return
    }

    CooldownDaemon.setState({ progress: progress * 100 })

    requestAnimationFrame(CooldownDaemon.update)
  }

  private static setState(state: Partial<CooldownState>) {
    CooldownDaemon.store.setState(
      state as Pick<CooldownState, keyof CooldownState>
    )
  }

  static get state(): CooldownState {
    return CooldownDaemon.store.getState()
  }

  static on(f: Listener<CooldownState>) {
    CooldownDaemon.store.subscribe(f)
  }

  static off(f: Listener<CooldownState>) {
    CooldownDaemon.store.unsubscribe(f)
  }
}
