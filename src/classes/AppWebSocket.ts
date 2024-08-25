import { MessageData } from 'src/types/actions'
import { AppConfig } from './AppConfig'
import { AppCanvas } from './AppCanvas'
import { GeneralStore } from 'src/managers/general'

export class AppWebSocket {
  private static ws: WebSocket

  public static connect() {
    this.createWebSocket()
    this.setupEventListeners()
  }

  private static createWebSocket() {
    this.ws = new WebSocket(
      AppConfig.url.api.replace('http', 'ws') + '/pixels/socket'
    )
  }

  private static setupEventListeners() {
    this.ws.addEventListener('open', this.onOpen.bind(this))
    this.ws.addEventListener('message', this.onMessage.bind(this))
    // this.ws.addEventListener('close', this.onClose.bind(this))
    this.ws.addEventListener('error', this.onError.bind(this))
  }

  private static async onMessage(event: MessageEvent<string | Blob>) {
    const data: MessageData =
      event.data instanceof Blob
        ? await new Response(event.data).json()
        : JSON.parse(event.data)

    if (!GeneralStore.getState().canvasLoaded) return

    switch (data.op) {
      case 'PLACE': {
        let str = data.color.substring(1)
        const result = []
        while (str.length >= 2) {
          result.push(parseInt(str.substring(0, 2), 16))
          str = str.substring(2, str.length)
        }
        AppCanvas.putPixel(data.x, data.y, result)
        break
      }
      case 'ENDED':
        break
    }
  }

  private static onOpen() {}

  private static onError() {}
}
