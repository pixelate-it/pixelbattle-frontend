import { ProfileDaemon } from 'src/core/daemons/profile'
import {
  ApiErrorResponse,
  ApiInfo,
  ApiPixel,
  ApiResponse,
  ApiTags,
  PixelInfo,
  ProfileInfo
} from './types'
import { NotificationDaemon } from 'src/core/daemons/notifications'
import { config } from 'src/config'
import { Cookie } from '../storage/cookie'
import { ServerNotificationMap } from './notifications'

export default class ApiRequest {
  public static async pixels() {
    return (await fetch(config.url.api + '/pixels.png')).blob()
  }

  public static info(): Promise<ApiInfo> {
    return ApiRequest.get('/game')
  }

  public static profile(): Promise<ProfileInfo> {
    return ApiRequest.get<ProfileInfo>(`/users/${Cookie.get('userid')}`)
  }

  public static getPixel(x: number, y: number): Promise<PixelInfo> {
    return ApiRequest.get<PixelInfo>(`/pixels?x=${x}&y=${y}`)
  }

  public static putPixel(pixel: ApiPixel) {
    return ApiRequest.put(`/pixels`, pixel, true)
  }

  public static tags(): Promise<ApiTags> {
    return ApiRequest.get(`/pixels/tag`)
  }

  public static changeTag(tag: string): Promise<ApiResponse> {
    return ApiRequest.post(
      `/users/${ProfileDaemon.getState().profile!.id}/tag`,
      { tag },
      true
    )
  }

  private static post = <T extends object>(
    url: string,
    body: unknown,
    withCredentials: boolean = false
  ) => ApiRequest.fetch<T>({ url, method: 'POST', withCredentials, body })

  private static put = <T extends object>(
    url: string,
    body: unknown,
    withCredentials: boolean = false
  ) => ApiRequest.fetch<T>({ url, method: 'PUT', withCredentials, body })

  private static get = <T extends object>(
    url: string,
    withCredentials: boolean = false
  ) => ApiRequest.fetch<T>({ url, method: 'GET', withCredentials })

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
      if (ProfileDaemon.getState().profile!)
        headers['Authorization'] =
          `Bearer ${ProfileDaemon.getState().profile!.token}`
    }

    return fetch(config.url.api + options.url, {
      method: options.method,
      headers: options.method === 'GET' ? undefined : headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    })
      .then((res) => res.json() as Promise<T | ApiErrorResponse>)
      .then(ApiRequest.checkForErrors<T>)
  }

  private static checkForErrors<T extends object | ApiErrorResponse>(
    res: T | ApiErrorResponse
  ) {
    if ('error' in res && res.error) {
      ApiRequest.processError(res)

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
