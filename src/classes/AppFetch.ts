import { config } from "../config"
import { ApiInfo } from "../interfaces/Info"
import { ApiPixel, PixelInfo } from "../interfaces/Pixels"
import { ProfileInfo } from "../interfaces/Profile"
import { ApiTags } from "../interfaces/Tag"
import { ProfileManager } from "../managers/profile"
import { NotificationInfo, NotificationsManager } from "../managers/notifications"
import { Point } from "pixi.js"
import { ApiErrorResponse, ApiResponse } from "../interfaces/ApiResponse"
import { ServerNotificationMap } from "../lib/notificationMap"

export class AppFetch {
    static async post<T extends {}>(url: string, body: any) {
        return fetch(config.url.api + url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json() as Promise<T | ApiErrorResponse>)
        .then(AppFetch.checkForErrors<T>)
    }



    static async put<T extends {}>(url: string, body: any) {
        return fetch(config.url.api + url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json() as Promise<T | ApiErrorResponse>)
        .then(AppFetch.checkForErrors<T>)
    }

    static processError(error: ApiErrorResponse) {
        NotificationsManager.addNotification({
            ...ServerNotificationMap[error.reason] ?? ServerNotificationMap.Unknown,
            type: "error"
        })
    }

    static async get<T extends {}>(url: string) {
        return fetch(config.url.api + url)
            .then(res => res.json() as Promise<T | ApiErrorResponse>)
            .then(AppFetch.checkForErrors<T>)
    }

    static checkForErrors<T extends {} | ApiErrorResponse>(res: T | ApiErrorResponse){
        if ("error" in res && res.error) {
            AppFetch.processError(res)

            return Promise.reject(res)
        }

        return res as T
    }

    static async pixels() {
        return fetch(config.url.api + "/pixels.bmp")
            .then(res => res.arrayBuffer())
    }


    static async info(): Promise<ApiInfo> {

        return AppFetch.get<ApiInfo>("/game")
    }

    static async profile(): Promise<ProfileInfo> {
        const id = ProfileManager.id.value

        return AppFetch.get<ProfileInfo>(`/users/${id}`)
    }

    static async getPixel(point: Point): Promise<PixelInfo> {
        return AppFetch.get<PixelInfo>(`/pixels?x=${point.x}&y=${point.y}`)
    }

    static async tags(): Promise<ApiTags> {
        return AppFetch.get<ApiTags>("/pixels/tag")
    }

    static async putPixel(pixel: ApiPixel) {
        return AppFetch.put<ApiResponse>("/pixels", {
            token: ProfileManager.token.value,
            ...pixel
        })
    }

    static async changeTag(tag: string): Promise<ApiResponse> {
        const id = ProfileManager.id.value

        return AppFetch.post<ApiResponse>(`/users/${id}/tag`, {
            token: ProfileManager.token.value,
            tag
        })
    }
}

// interface ApiGoodResponse extends ApiResponse {
//     error: false;
// }

// interface ApiError {
//     statusCode: number;
//     error: string;
//     message: string;
// }