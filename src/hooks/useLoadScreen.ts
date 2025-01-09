import { GeneralDaemon } from 'src/core/daemons/general'
import { ComputedActions, useDaemonComputed } from './util/useDaemonComputed'
import { GeneralState } from 'src/core/daemons/types'
import {
  CriticalError,
  WebSocketConnectionError,
  WebSocketError
} from 'src/core/util/Errors'

interface ComputedValues<T> extends ComputedActions<T> {
  title: (value: T) => string
  message: (value: T) => string
  isCritical: (value: T) => boolean
  isConnectionError: (value: T) => boolean
}

export const useLoadScreen = () => {
  const [info, all] = useDaemonComputed<
    GeneralState,
    ComputedValues<GeneralState>
  >(GeneralDaemon, {
    title: (d) => {
      if (d.error) {
        return d.error instanceof CriticalError
          ? 'Случилась ошибка внутри кода'
          : d.error instanceof WebSocketError
            ? d.error.title
            : 'Неизвестная ошибка'
      }
      return 'Соеденение с сервером'
    },
    message: (d) => {
      if (d.error) {
        return d.error.message!
      }
      return ''
    },
    isCritical: (d) => {
      return d.error instanceof CriticalError
    },
    isConnectionError: (d) => {
      return d.error instanceof WebSocketError
    }
  })

  return { info, all }
}
