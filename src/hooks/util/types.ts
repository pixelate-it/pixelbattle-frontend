import { Listener } from 'unistore'

export interface Daemon<T> {
  on: (f: Listener<T>) => void
  off: (f: Listener<T>) => void
  getState: () => T
}
