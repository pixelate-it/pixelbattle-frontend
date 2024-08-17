export interface ApiInfo {
  name: string
  ended: boolean
  cooldown: number
  online: number
  canvas: {
    width: number
    height: number
  }
}
