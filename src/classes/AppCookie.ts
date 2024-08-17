import cookie from 'js-cookie'
import { CookieMap } from 'src/types/cookies'
import { AppConfig } from './AppConfig'

const url =
  (AppConfig.url.api.split('//')[1].includes(':') ? '' : '.') +
  AppConfig.url.api
    .split('//')
    .slice(-1)[0]
    .split(':')[0]
    .split('.')
    .slice(-2)
    .join('.')

export const AppCookie = {
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
