import { config } from 'src/config'
import { CanvasStorage } from 'src/core/place/storage/canvas'
import { MessageData } from '../classes/api/types'
import Color from '../classes/primitives/Color'
import { GeneralDaemon } from '../daemons/general'
import {
  WebSocketClosedNormallyError,
  WebSocketConnectionError,
  WebSocketGoingAwayError,
  WebSocketInternalServerError,
  WebSocketProtocolError
} from '../util/Errors'

export class ApiWebSocket {
  private static ws: WebSocket
  public static attempts: number = 0

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
      config.url.api.replace('http', 'ws') + '/pixels/socket'
    )
  }

  private static setupEventListeners() {
    this.ws.onopen = this.onOpen.bind(this)
    this.ws.onmessage = this.onMessage.bind(this)
    this.ws.onclose = this.onClose.bind(this)
    this.ws.onerror = this.onError.bind(this)
  }

  private static async onMessage(event: MessageEvent<string | Blob>) {
    const data: MessageData =
      event.data instanceof Blob
        ? await new Response(event.data).json()
        : JSON.parse(event.data)

    switch (data.op) {
      case 'PLACE': {
        CanvasStorage.putPixel(data.x, data.y, new Color(data.color))
        break
      }
      case 'ENDED':
        break
    }
  }

  private static onOpen() {
    GeneralDaemon.reconnectRun()
  }

  private static onError(_: Event) {
    GeneralDaemon.setError(new WebSocketConnectionError())
    ApiWebSocket.reconnect()
  }

  private static onClose(event: CloseEvent) {
    if (event.code === 1000)
      GeneralDaemon.setError(new WebSocketClosedNormallyError())
    else if (event.code === 1001)
      GeneralDaemon.setError(new WebSocketGoingAwayError())
    else if (event.code === 1006) {
      GeneralDaemon.setError(new WebSocketConnectionError())
      ApiWebSocket.reconnect()
    } else if (event.code === 1008)
      GeneralDaemon.setError(new WebSocketProtocolError())
    else if (event.code === 1011)
      GeneralDaemon.setError(new WebSocketInternalServerError())
    else GeneralDaemon.setError(new WebSocketConnectionError())
  }

  private static reconnect() {
    GeneralDaemon.setReconnecting(true, this.attempts)
    if (!this.closed) return
    if (this.attempts >= config.ws.reconnectAttempts) return
    setTimeout((() => this.connect()).bind(this), config.time.ws)
    this.attempts++
  }
}
