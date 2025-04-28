import createStore, { Listener } from 'unistore'
import {
  MessageData,
  WebSocketError,
  WebSocketState,
  WebSocketStatus
} from './types'
import { config } from 'src/config'
import { CanvasStorage } from '../storage'
import Color from '../util/сolor'
import { GeneralDaemon } from './general'

export default class WebSocketDaemon {
  private static connection: WebSocket
  private static store = createStore<WebSocketState>({
    status: WebSocketStatus.CONNECTING,
    attempts: 0
  })

  public static connect() {
    WebSocketDaemon.setState({
      status: WebSocketStatus.CONNECTING
    })
    this.createWebSocket()
    this.setupEventListeners()
  }

  private static createWebSocket() {
    this.connection = new WebSocket(
      config.url.api.replace('http', 'ws') + '/pixels/socket'
    )
  }

  private static setupEventListeners() {
    WebSocketDaemon.connection.onopen = this.onOpen.bind(this)
    WebSocketDaemon.connection.onmessage = this.onMessage.bind(this)
    WebSocketDaemon.connection.onclose = this.onClose.bind(this)
    WebSocketDaemon.connection.onerror = this.onError.bind(this)
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
    WebSocketDaemon.setState({
      status: WebSocketStatus.ACTIVE,
      error: undefined
    })
    GeneralDaemon.sync()
  }

  private static onError(_: Event) {
    WebSocketDaemon.setState({
      status: WebSocketStatus.CLOSED,
      error: WebSocketError.CONNECTION
    })
    WebSocketDaemon.reconnect()
  }

  private static onClose(event: CloseEvent) {
    if (event.code === 1000)
      WebSocketDaemon.setState({ status: WebSocketStatus.CLOSED })
    else if (event.code === 1001)
      WebSocketDaemon.setState({
        status: WebSocketStatus.CLOSED,
        error: WebSocketError.AWAY
      })
    else if (event.code === 1006) {
      WebSocketDaemon.setState({
        status: WebSocketStatus.CLOSED,
        error: WebSocketError.CONNECTION
      })
      WebSocketDaemon.reconnect()
    } else if (event.code === 1008)
      WebSocketDaemon.setState({
        status: WebSocketStatus.CLOSED,
        error: WebSocketError.PROTOCOL
      })
    else if (event.code === 1011)
      WebSocketDaemon.setState({
        status: WebSocketStatus.CLOSED,
        error: WebSocketError.INTERNAL
      })
    else
      WebSocketDaemon.setState({
        status: WebSocketStatus.CLOSED,
        error: WebSocketError.CONNECTION
      })
  }

  static get closed() {
    return (
      WebSocketDaemon.connection.readyState === WebSocket.CLOSED ||
      WebSocketDaemon.connection.readyState === WebSocket.CLOSING
    )
  }

  private static reconnect() {
    if (!WebSocketDaemon.closed) return
    if (WebSocketDaemon.state.attempts >= config.ws.reconnectAttempts) return
    setTimeout((() => this.connect()).bind(this), config.time.ws)
    WebSocketDaemon.state.attempts++
  }

  private static setState(state: Partial<WebSocketState>) {
    WebSocketDaemon.store.setState(
      state as Pick<WebSocketState, keyof WebSocketState>
    )
  }

  static get state(): WebSocketState {
    return WebSocketDaemon.store.getState()
  }

  static on(f: Listener<WebSocketState>) {
    WebSocketDaemon.store.subscribe(f)
  }

  static off(f: Listener<WebSocketState>) {
    WebSocketDaemon.store.unsubscribe(f)
  }
}
