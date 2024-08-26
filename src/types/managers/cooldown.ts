export interface CooldownState {
  progress: number
  reqId: number
  startTime: number
  hasCooldown: boolean
}
