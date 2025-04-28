import { config } from 'src/config'
import {
  ApiInfo,
  ProfileInfo,
  PixelInfo,
  ApiPixel,
  ApiTags,
  ApiResponse,
  ApiErrorResponse
} from './types'
import { ServerNotificationMap } from '../constants/notifications'
import { NotificationDaemon } from './notifications'
import { ProfileDaemon } from './profile'
import { Cookie } from '../storage/cookie'

export default class RequestsDaemon {
  public static async pixels() {
    return (await fetch(config.url.api + '/pixels.png')).blob()
  }

  public static info(): Promise<ApiInfo> {
    return RequestsDaemon.get('/game')
  }

  public static profile(): Promise<ProfileInfo> {
    return RequestsDaemon.get<ProfileInfo>(`/users/${Cookie.get('userid')}`)
  }

  public static getPixel(x: number, y: number): Promise<PixelInfo> {
    return RequestsDaemon.get<PixelInfo>(`/pixels?x=${x}&y=${y}`)
  }

  public static putPixel(pixel: ApiPixel) {
    return RequestsDaemon.put(`/pixels`, pixel, true)
  }

  public static tags(): Promise<ApiTags> {
    return RequestsDaemon.get(`/pixels/tag`)
  }

  public static changeTag(tag: string): Promise<ApiResponse> {
    return RequestsDaemon.post(
      `/users/${ProfileDaemon.state.profile!.id}/tag`,
      { tag },
      true
    )
  }

  private static post = <T extends object>(
    url: string,
    body: unknown,
    withCredentials: boolean = false
  ) => RequestsDaemon.fetch<T>({ url, method: 'POST', withCredentials, body })

  private static put = <T extends object>(
    url: string,
    body: unknown,
    withCredentials: boolean = false
  ) => RequestsDaemon.fetch<T>({ url, method: 'PUT', withCredentials, body })

  private static get = <T extends object>(
    url: string,
    withCredentials: boolean = false
  ) => RequestsDaemon.fetch<T>({ url, method: 'GET', withCredentials })

  private static fetch<T extends object>(options: {
    url: string
    method: 'POST' | 'PUT' | 'GET'
    withCredentials: boolean
    body?: unknown
  }) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (options.withCredentials) {
      if (ProfileDaemon.state.profile!)
        headers['Authorization'] =
          `Bearer ${ProfileDaemon.state.profile!.token}`
    }

    return fetch(config.url.api + options.url, {
      method: options.method,
      headers: options.method === 'GET' ? undefined : headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    })
      .then((res) => res.json() as Promise<T | ApiErrorResponse>)
      .then(RequestsDaemon.checkForErrors<T>)
  }

  private static checkForErrors<T extends object | ApiErrorResponse>(
    res: T | ApiErrorResponse
  ) {
    if ('error' in res && res.error) {
      RequestsDaemon.processError(res)

      return Promise.reject(res)
    }

    return res as T
  }

  private static processError(error: ApiErrorResponse) {
    const notification = ServerNotificationMap[error.reason] ?? {
      title: 'Неизвестная ошибка (С)',
      message: error.reason
    }
    NotificationDaemon.addNotification({
      ...notification,
      type: 'error'
    })
  }
}
