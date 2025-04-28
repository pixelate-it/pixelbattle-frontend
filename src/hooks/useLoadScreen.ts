import { GeneralDaemon } from 'src/core/daemons/general'
import { ComputedActions, useDaemonComputed } from './util/useDaemonComputed'
import { useDaemon } from './util/useDaemon'
import { ErrorDaemon } from 'src/core/daemons/error'
import {
  ErrorState,
  GeneralState,
  GeneralStatus,
  WebSocketError
} from 'src/core/daemons/types'
import WebSocketDaemon from 'src/core/daemons/websocket'

interface ComputedValues<T> extends ComputedActions<T> {
  title: (value: T) => string
  recommendations: (value: T) => string[]
}

interface ComputedValuesErrors<T> extends ComputedActions<T> {
  info: (value: T) => string
}

export const useLoadScreen = () => {
  const [{ status }, info] = useDaemonComputed<
    GeneralState,
    ComputedValues<GeneralState>
  >(GeneralDaemon, {
    title: ({ status }) => {
      switch (status) {
        case GeneralStatus.CONNECTING:
          return 'Идёт соеденение с сервером'
        case GeneralStatus.INTERNAL_ERROR:
          return 'Внутреняя ошибка'
        case GeneralStatus.WEBSOCKET_ERROR:
          return 'Ошибка соеденения'
        default:
          return ''
      }
    },
    recommendations({ status }) {
      switch (status) {
        case GeneralStatus.INTERNAL_ERROR:
          return [
            'Случилась ошибка внутри кода. Что я могу сделать?',
            'Сообщите разработчикам информацию ниже'
          ]
        case GeneralStatus.WEBSOCKET_ERROR:
          const statusWs = WebSocketDaemon.state.error
          switch (statusWs) {
            case WebSocketError.AWAY:
              return [
                'Случилась ошибка соеденения, ниже приведены возможные причины',
                'Вы отключены от сети',
                'Сервер был отключён'
              ]
            case WebSocketError.INTERNAL:
              return [
                'Случилась внутрення ошибка сервера. Пожалуйста сообщите разработчикам',
                'Вы можете сообщить об этом в нашем дискорд сервере'
              ]
            case WebSocketError.CONNECTION:
              return [
                'Соеденение оборвано, ниже приведены возможные причины',
                'Проблемы с соеденением',
                'Сервер разорвал с вами соеденение'
              ]
            case WebSocketError.PROTOCOL:
              return [
                'Случилась ошибка соеденения, ниже приведены возможные причины',
                'Сообщите разработчикам, что случилась ошибка протокола при соеденении'
              ]
            case WebSocketError.NORMALLY:
              return ['Сервер был отключён, или вы были отключены от него']
          }
          return []
        default:
          return []
      }
    }
  })
  const { attempts } = useDaemon(WebSocketDaemon)
  const [_, error] = useDaemonComputed<
    ErrorState,
    ComputedValuesErrors<ErrorState>
  >(ErrorDaemon, {
    info: ({ internalError }) => {
      if (internalError)
        return internalError.name + '\n' + internalError.message
      return ''
    }
  })

  return { status, info, attempts, error }
}
