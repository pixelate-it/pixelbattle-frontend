import { Point } from "pixi.js"
import { config } from "../config"
import { ApiInfo } from "../interfaces/Info"
import { InfoManager } from "../managers/info"
import { PlaceManager } from "../managers/place"
import { MyBuffer } from "./MyBuffer"
import { ApiPixel, ApiPixels } from "../interfaces/Pixels"
import { ProfileInfo } from "../interfaces/Profile"
import { ApiTags } from "../interfaces/Tag"
import { ProfileManager } from "../managers/profile"

export class MyFetch {
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
        return fetch(config.url.api + "/info")
            .then((res) => res.json() as Promise<ApiInfo>)
    }

    static async place(): Promise<ApiPixels> {
        return fetch(config.url.api + "/pixels/get")
            .then(res => res.json() as Promise<ApiPixels>)

    }

    static async profile(token: string): Promise<ProfileInfo> {
        // return {
        //     userID: "914240860101681163",
        //     cooldown: 0,
        //     banned: false,
        //     username: "Elias",
        //     tag: "",
        // }

        return fetch(config.url.api + "/user/getInfo", {
            method: "POST",
            body: JSON.stringify({
                token
            }),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json() as Promise<ProfileInfo>)
    }

    static async tags(): Promise<ApiTags> {


        // return {
        //     tags: [
        //         ["tag1", 100],
        //         ["tag2", 50],
        //     ],
        //     pixels: {
        //         all: 200,
        //         used: 100,
        //         unused: 100
        //     }
        // }
        return fetch(config.url.api + "/pixels/get/tag")
            .then(res => res.json() as Promise<ApiTags>)
    }

    static async putPixel(pixel: ApiPixel) {
        return fetch(config.url.api + "/pixels/put", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: ProfileManager.token.value, ...pixel })
        }).then(res => res.json() as unknown)
    }

    static async changeTag(tag: string): Promise<ApiResponse> {
        // return {
        //     error: false,
        //     reason: "OK"
        // }

        return fetch(config.url.api + "/user/changeTag", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tag, token: ProfileManager.token.value })
        }).then(res => res.json() as Promise<ApiResponse>)
    }
}

interface ApiResponse {
    error: boolean;
    reason: string;
}