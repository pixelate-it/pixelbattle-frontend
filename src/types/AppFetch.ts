import { config } from "../config"
import { ApiInfo } from "../interfaces/Info"
import { ApiPixel, PixelInfo } from "../interfaces/Pixels"
import { ProfileInfo } from "../interfaces/Profile"
import { ApiTags } from "../interfaces/Tag"
import { ProfileManager } from "../managers/profile"
import { NotificationsManager } from "../managers/notifications"
import { Point } from "pixi.js"

export class MyFetch {
    static async post<T extends {}>(url: string, body: any) {
        return fetch(config.url.api + url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json() as Promise<T | ApiError>)
        .then(MyFetch.checkForErrors<T>)
    }

    static async pixels() {
        return fetch(config.url.api + "/pixels.bmp")
            .then(res => res.arrayBuffer())
    }


    static async put<T extends {}>(url: string, body: any) {
        return fetch(config.url.api + url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json() as Promise<T | ApiError>)
        .then(MyFetch.checkForErrors<T>)
    }

    static processError(error: ApiError) {
        if (error.statusCode === 429) {
            NotificationsManager.addNotification({
                type: "error",
                title: "Rate limit",
                message: "Подождите пару секунд"
            })
        } else {
            NotificationsManager.addNotification({
                type: "error",
                title: "Произошла ошибка",
                message: error.message
            })
        }
    }

    static async get<T extends {}>(url: string) {
        return fetch(config.url.api + url)
            .then(res => res.json() as Promise<T | ApiError>)
            .then(MyFetch.checkForErrors)
    }

    static checkForErrors<T extends {}>(res: T | ApiError): T | ApiError {
        if ("error" in res && res.error) {
            MyFetch.processError(res as ApiError)
        }

        return res
    }

    static async info(): Promise<ApiInfo> {
        // return {
        //     name: "season:blank",
        //     cooldown: 0,
        //     size: {
        //         width: 160,
        //         height: 80
        //     },
        //     players: {
        //         online: 1,
        //         total: 10
        //     }
        // }
        return MyFetch.get<ApiInfo>("/info").then(res => {
            if (!("error" in res)) return res;

            return {
                name: "Unknown",
                cooldown: 0,
                ended: false,
                players: {
                    online: -1,
                    total: -1
                }
            }
        })
    }

    static async profile(): Promise<ProfileInfo> {
        const id = ProfileManager.id.value

        return MyFetch.get<ProfileInfo>(`/users/${id}`).then(res => {
            if (!("error" in res)) return res;

            return {
                userID: "-1",
                cooldown: 0,
                banned: false,
                username: "???",
                tag: "",
            }
        })
    }

    static async getPixel(point: Point): Promise<PixelInfo> {
        return MyFetch.get<PixelInfo>(`/pixels?x=${point.x}&y=${point.y}`).then(res => {
            if (!("error" in res)) return res;

            return {
                author: null,
                tag: null
            }
        })
    }

    static async tags(): Promise<ApiTags> {

        return MyFetch.get<ApiTags>("/pixels/tag").then(res => {
            if (!("error" in res)) return res;

            return {
                tags: [],
                pixels: {
                    all: 0,
                    used: 0,
                    unused: 0
                }
            }
        })
    }

    static async putPixel(pixel: ApiPixel) {
        return MyFetch.put("/pixels", {
            token: ProfileManager.token.value,
            ...pixel
        })
    }

    static async changeTag(tag: string): Promise<ApiResponse> {
        const id = ProfileManager.id.value

        return MyFetch.post<ApiResponse>(`/users/${id}/tag`, {
            token: ProfileManager.token.value,
            tag
        }).then(res => {
            if (!("message" in res)) return res;

            return {
                error: true,
                reason: res.message
            }
        })
    }
}

interface ApiResponse {
    error: boolean;
    reason: string;
}

interface ApiError {
    statusCode: number;
    error: string;
    message: string;
}