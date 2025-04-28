import createStore, { Listener } from 'unistore'
import { ErrorState } from './types'
import { InternalError } from '../util/errors'

export class ErrorDaemon {
  private static store = createStore<ErrorState>({
    isErrored: false
  })

  static setError(error: InternalError) {
    ErrorDaemon.setState({
      isErrored: true,
      internalError: error
    })
  }

  private static setState(state: Partial<ErrorState>) {
    ErrorDaemon.store.setState(state as Pick<ErrorState, keyof ErrorState>)
  }

  static get state(): ErrorState {
    return ErrorDaemon.store.getState()
  }

  static on(f: Listener<ErrorState>) {
    ErrorDaemon.store.subscribe(f)
  }

  static off(f: Listener<ErrorState>) {
    ErrorDaemon.store.unsubscribe(f)
  }
}
