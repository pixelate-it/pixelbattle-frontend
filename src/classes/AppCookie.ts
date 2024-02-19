import cookie from "js-cookie"
import { config } from '../config'
import { DiscordUserId } from "../interfaces/Profile"

interface CookieMap {
    userid: DiscordUserId;
    token: string;
}

export class AppCookie {
    static readonly url = (config.url.api.split('//')[1].includes(':') ? '' : '.') +
        config.url.api
        .split('//')
        .slice(-1)[0]
        .split(':')[0]
        .split('.')
        .slice(-2).join('.'); // so that it works both on localhost and in production

    public static get<K extends keyof CookieMap>(key: K): CookieMap[K] | undefined {
        return cookie.get(key) 
    }

    public static set<K extends keyof CookieMap>(key: K, value: CookieMap[K]): void {
        cookie.set(key, value)
    }

    public static remove<K extends keyof CookieMap>(key: K): void {
        cookie.remove(key, { domain: this.url })
    }

    public static clear() {
        Object.keys(cookie.get()).forEach(key => cookie.remove(key, { domain: this.url }))
    }
}