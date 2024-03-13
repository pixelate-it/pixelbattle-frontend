import { config } from "../config";
import { ApiInfo } from "../interfaces/Info";
import { ApiPixel, PixelInfo } from "../interfaces/Pixels";
import { ProfileInfo } from "../interfaces/Profile";
import { ApiTags } from "../interfaces/Tag";
import { ProfileManager } from "../managers/profile";
import { NotificationsManager } from "../managers/notifications";
import { Point } from "@pixi/math";
import { ApiErrorResponse, ApiResponse } from "../interfaces/ApiResponse";
import { ServerNotificationMap } from "../lib/notificationMap";

export class AppFetch {
    private static fetch<T extends {}>(options: { url: string, method: "POST" | "PUT" | "GET", withCredentials: boolean, body?: unknown }) {
        return fetch(config.url.api + options.url, {
            credentials: options.withCredentials ? 'include' : 'omit',
            method: options.method,
            body: options.body ? JSON.stringify(options.body) : undefined,
            headers: options.method === "GET" ? undefined : {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json() as Promise<T | ApiErrorResponse>)
            .then(AppFetch.checkForErrors<T>);
    }

    static async post<T extends {}>(url: string, body: unknown, withCredentials: boolean = false) {
        return AppFetch.fetch<T>({ url, method: "POST", withCredentials, body })
    }

    static async put<T extends {}>(url: string, body: unknown, withCredentials: boolean = false) {
        return AppFetch.fetch<T>({ url, method: "PUT", withCredentials, body })
    }

    static async get<T extends {}>(url: string, withCredentials: boolean = false) {
        return AppFetch.fetch<T>({ url, method: "GET", withCredentials })
    }


    static processError(error: ApiErrorResponse) {
        const notification = ServerNotificationMap[error.reason] ?? {
            title: "Неизвестная ошибка (С)",
            message: error.reason,
        }

        NotificationsManager.addNotification({
            ...notification,
            type: "error"
        })
    }



    static checkForErrors<T extends {} | ApiErrorResponse>(res: T | ApiErrorResponse) {
        if ("error" in res && res.error) {
            AppFetch.processError(res)

            return Promise.reject(res)
        }

        return res as T
    }

    static async pixels() {
        return fetch(config.url.api + "/pixels.png")
            .then(res => res.arrayBuffer())
    }


    static async info(): Promise<ApiInfo> {
        return AppFetch.get<ApiInfo>("/game")
    }

    static async profile(): Promise<ProfileInfo> {
        return AppFetch.get<ProfileInfo>(`/users/${ProfileManager.profile.value?.id}`)
    }

    static async getPixel(point: Point): Promise<PixelInfo> {
        return AppFetch.get<PixelInfo>(`/pixels?x=${point.x}&y=${point.y}`)
    }

    static async tags(): Promise<ApiTags> {
        return AppFetch.get<ApiTags>("/pixels/tag")
    }

    static async putPixel(pixel: ApiPixel) {
        return AppFetch.put<ApiResponse>("/pixels", pixel, true)
    }

    static async changeTag(tag: string): Promise<ApiResponse> {
        return AppFetch.post<ApiResponse>(`/users/${ProfileManager.profile.value?.id}/tag`, { tag }, true)
    }
}