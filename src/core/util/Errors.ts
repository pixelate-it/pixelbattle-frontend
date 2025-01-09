export class CriticalError extends Error {}

export class GlShaderBuildError extends CriticalError {
  lineOffset?: number

  constructor(msg: string, lineOffset?: number) {
    super()
    this.message = msg
    this.lineOffset = lineOffset
  }
}

export class GlDeprecatedBrowserError extends CriticalError {
  constructor() {
    super()
  }
}

export class RenderError extends CriticalError {}

export class DomEventError extends CriticalError {}

export class PluginBusError extends CriticalError {}

export class WebSocketError extends Error {
  title: string
  reasons: string[]

  constructor(title: string, reasons: string[]) {
    super()
    this.title = title
    this.reasons = reasons
  }
}

export class WebSocketClosedNormallyError extends WebSocketError {
  constructor() {
    super('Вас отсоеденили от сервера', [
      'У вас пропало интернет соеденение, или оно нестабильно',
      'Вы были забанены',
      'Или отключенны по подозрениям в читах',
      'Внутреняя ошибка сервера'
    ])
  }
}

export class WebSocketGoingAwayError extends WebSocketError {
  constructor() {
    super('Сервер был отключён', [
      'У вас пропало интернет соеденение, или оно нестабильно',
      'Сервер был отключён, или ушёл на тех обслуживание'
    ])
  }
}

export class WebSocketConnectionError extends WebSocketError {
  constructor() {
    super('Ошибка соеденения с сервером', [
      'У вас пропало интернет соеденение, или оно нестабильно'
    ])
  }
}

export class WebSocketProtocolError extends WebSocketError {
  constructor() {
    super('Нарушение протоколов связи с сервером', [
      'Возможно это ошибка включенного VPN'
    ])
  }
}

export class WebSocketInternalServerError extends WebSocketError {
  constructor() {
    super('Внутраняя ошибка сервера', [
      'На сервере случилось нечто ужасное! Разработчики уже занимаються этим вопросом'
    ])
  }
}
