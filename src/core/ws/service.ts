export class ApiWsService {
  private static firstStart = true

  static start() {
    if (!this.firstStart) {
      // Type here notification for debug
      return
    }
    this.firstStart = false
  }
}
