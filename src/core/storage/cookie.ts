import cookie from 'js-cookie'
import { config } from 'src/config'
import { CookieMap } from './types'

const url =
  (config.url.api.split('//')[1].includes(':') ? '' : '.') +
  config.url.api
    .split('//')
    .slice(-1)[0]
    .split(':')[0]
    .split('.')
    .slice(-2)
    .join('.')

export const Cookie = {
  get<K extends keyof CookieMap>(key: K): CookieMap[K] | undefined {
    return cookie.get(key)
  },

  set<K extends keyof CookieMap>(key: K, value: CookieMap[K]): void {
    cookie.set(key, value)
  },

  remove<K extends keyof CookieMap>(key: K): void {
    cookie.remove(key, { domain: url })
  },

  clear() {
    Object.keys(cookie.get()).forEach((key) =>
      cookie.remove(key, { domain: url })
    )
  }
}
