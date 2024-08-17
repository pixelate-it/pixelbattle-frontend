import { ApiErrorResponse, ApiResponse } from 'src/types/response'
import { AppConfig } from './AppConfig'
import { ApiInfo, ApiPixel, PixelInfo, ProfileInfo } from 'src/types/api'
import { AppCookie } from './AppCookie'
// import { NotificationActions } from 'src/stores/notifications'

const myFetch = <T extends object>(options: {
  url: string
  method: 'POST' | 'PUT' | 'GET'
  body?: unknown
}) =>
  fetch(AppConfig.url.api + options.url, {
    credentials: 'include',
    method: options.method,
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers:
      options.method === 'GET'
        ? undefined
        : {
            'Content-Type': 'application/json'
          }
  })
    .then((res) => res.json() as Promise<T | ApiErrorResponse>)
    .then(checkForErrors<T>)

const checkForErrors = <T extends object | ApiErrorResponse>(
  res: T | ApiErrorResponse
) => {
  if ('error' in res && res.error) {
    // processError(res)

    return Promise.reject(res)
  }

  return res as T
}

// const processError = (error: ApiErrorResponse) => {
//   // const notification = ServerNotificationMap[error.reason] ?? {
//   //   title: 'Неизвестная ошибка (С)',
//   //   message: error.reason
//   // }
//   // NotificationActions.add({
//   //   ...notification,
//   //   type: 'error'
//   // })
// }

export const AppRequests = {
  async pixels() {
    return (await fetch(AppConfig.url.api + '/pixels.png')).blob()
  },

  info(): Promise<ApiInfo> {
    return myFetch<ApiInfo>({
      url: '/game',
      method: 'GET'
    })
  },

  profile(): Promise<ProfileInfo> {
    return myFetch<ProfileInfo>({
      url: `/users/${AppCookie.get('userId')}`,
      method: 'GET'
    })
  },

  getPixel(x: number, y: number): Promise<PixelInfo> {
    return myFetch<PixelInfo>({
      url: `/pixels?x=${x}&y=${y}`,
      method: 'GET'
    })
  },

  putPixel(pixel: ApiPixel) {
    return myFetch<PixelInfo>({
      url: `/pixels`,
      method: 'PUT',
      body: pixel
    })
  },

  tags(): Promise<PixelInfo> {
    return myFetch<PixelInfo>({
      url: `/pixels/tag`,
      method: 'GET'
    })
  },

  changeTag(tag: string): Promise<ApiResponse> {
    return myFetch<ApiResponse>({
      url: `/users/${AppCookie.get('userId')}/tag`,
      method: 'POST',
      body: { tag }
    })
  }
}
