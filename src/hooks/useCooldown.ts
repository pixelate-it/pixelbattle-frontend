import { CooldownDaemon } from 'src/core/daemons/cooldown'
import { useDaemon } from './util/useDaemon'

export const useCooldown = () => {
  const state = useDaemon(CooldownDaemon)

  return state
}
