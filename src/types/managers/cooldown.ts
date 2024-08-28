export interface CooldownState {
  startRequestTime: number
  progress: number
  reqId: number
  startTime: number
  hasCooldown: boolean
}
