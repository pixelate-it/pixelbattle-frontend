import { ApiErrorResponse, ApiResponse } from 'src/types/response'
import { AppConfig } from './AppConfig'
import {
  ApiInfo,
  ApiPixel,
  ApiTags,
  PixelInfo,
  ProfileInfo
} from 'src/types/api'
import { AppCookie } from './AppCookie'
import { ProfileStore } from 'src/managers/profile'
import { ServerNotificationMap } from './AppNotifications'
import { NotificationsManager } from 'src/managers/notifications'
// import { NotificationActions } from 'src/stores/notifications'

const myFetch = <T extends object>(options: {
  url: string
  method: 'POST' | 'PUT' | 'GET'
  withCredentials: boolean
  body?: unknown
}) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }

  if (options.withCredentials) {
    headers['Authorization'] =
      `Bearer ${ProfileStore.getState().profile!.token}`
  }

  return fetch(AppConfig.url.api + options.url, {
    method: options.method,
    headers: options.method === 'GET' ? undefined : headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  })
    .then((res) => res.json() as Promise<T | ApiErrorResponse>)
    .then(checkForErrors<T>)
}

const checkForErrors = <T extends object | ApiErrorResponse>(
  res: T | ApiErrorResponse
) => {
  if ('error' in res && res.error) {
    processError(res)

    return Promise.reject(res)
  }

  return res as T
}

const processError = (error: ApiErrorResponse) => {
  const notification = ServerNotificationMap[error.reason] ?? {
    title: 'Неизвестная ошибка (С)',
    message: error.reason
  }
  NotificationsManager.addNotification({
    ...notification,
    type: 'error'
  })
}

const post = <T extends object>(
  url: string,
  body: unknown,
  withCredentials: boolean = false
) => myFetch<T>({ url, method: 'POST', withCredentials, body })

const put = <T extends object>(
  url: string,
  body: unknown,
  withCredentials: boolean = false
) => {
  return myFetch<T>({ url, method: 'PUT', withCredentials, body })
}

const get = <T extends object>(
  url: string,
  withCredentials: boolean = false
) => {
  return myFetch<T>({ url, method: 'GET', withCredentials })
}

export const AppRequests = {
  async pixels() {
    return (await fetch(AppConfig.url.api + '/pixels.png')).blob()
  },

  info(): Promise<ApiInfo> {
    return get('/game')
  },

  profile(): Promise<ProfileInfo> {
    return get<ProfileInfo>(`/users/${AppCookie.get('userid')}`)
  },

  getPixel(x: number, y: number): Promise<PixelInfo> {
    return get<PixelInfo>(`/pixels?x=${x}&y=${y}`)
  },

  putPixel(pixel: ApiPixel) {
    return put(`/pixels`, pixel, true)
  },

  tags(): Promise<ApiTags> {
    return get(`/pixels/tag`)
  },

  changeTag(tag: string): Promise<ApiResponse> {
    return post(
      `/users/${ProfileStore.getState().profile!.id}/tag`,
      { tag },
      true
    )
  }
}
