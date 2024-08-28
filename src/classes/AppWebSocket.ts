import { MessageData } from 'src/types/actions'
import { AppConfig } from './AppConfig'
import { AppCanvas } from './AppCanvas'
import { GeneralStore } from 'src/managers/general'
import { AppColor } from './AppCanvas/AppColor'

export class AppWebSocket {
  private static ws: WebSocket

  static get closed() {
    return (
      this.ws.readyState === WebSocket.CLOSED ||
      this.ws.readyState === WebSocket.CLOSING
    )
  }

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
    this.ws.addEventListener('close', this.onClose.bind(this))
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
        AppCanvas.putPixel(data.x, data.y, new AppColor(data.color))
        break
      }
      case 'ENDED':
        break
    }
  }

  private static onOpen() {}

  private static onError(error: Event) {
    setTimeout(() => this.connect(), AppConfig.time.ws)
  }

  private static onClose(event: CloseEvent) {
    setTimeout(() => this.connect(), AppConfig.time.ws)
  }
}
