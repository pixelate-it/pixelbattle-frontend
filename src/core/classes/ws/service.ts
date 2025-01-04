import { NotificationDaemon } from 'src/core/daemons/notifications'
import { ConnectionStatus } from './status'

export class ApiService {
  static status: ConnectionStatus
  private static firstConnection = true
  private static attempts = 0

  static start() {
    if (!this.firstConnection) {
      return
    }
    this.firstConnection = false
  }

  private static connect() {
    W
  }

  static reconnect() {
    this.attempts++
    if (this.attempts === 3) {
      this.status = ConnectionStatus.ATTEMPTS_END
      return
    }

    setTimeout(() => {
      this.connect()
    }, 3000)
  }
}
