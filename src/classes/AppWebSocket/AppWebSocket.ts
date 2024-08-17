import { MessageData } from 'src/types/actions'
import { AppConfig } from '../AppConfig'
import { AppGame } from '../AppGame'
import { MutableRef } from 'preact/hooks'

export class AppWebSocket {
  private ws!: WebSocket

  constructor(private readonly gameRef: MutableRef<AppGame | undefined>) {}

  public connect() {
    this.createWebSocket()
    this.setupEventListeners()
  }

  private createWebSocket() {
    this.ws = new WebSocket(
      AppConfig.url.api.replace('http', 'ws') + '/pixels/socket'
    )
  }

  private setupEventListeners() {
    this.ws.addEventListener('open', this.onOpen.bind(this))
    this.ws.addEventListener('message', this.onMessage.bind(this))
    // this.ws.addEventListener('close', this.onClose.bind(this))
    this.ws.addEventListener('error', this.onError.bind(this))
  }

  private async onMessage(event: MessageEvent<string | Blob>) {
    const data: MessageData =
      event.data instanceof Blob
        ? await new Response(event.data).json()
        : JSON.parse(event.data)

    if (this.gameRef.current?.appCanvas.empty) {
      return
    }

    switch (data.op) {
      case 'PLACE': {
        let str = data.color.substring(1)
        const result = []
        while (str.length >= 2) {
          result.push(parseInt(str.substring(0, 2), 16))
          str = str.substring(2, str.length)
        }
        this.gameRef.current!.appCanvas.putPixel(data.x, data.y, result)
        break
      }
      case 'ENDED':
        break
    }
  }

  private onOpen() {}

  private onError() {}
}
