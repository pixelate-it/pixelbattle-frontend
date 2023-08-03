import { app } from "../app";
import { config } from "../config";
import { modals } from "../lib/modals";


export class RequestController {
    constructor() {
    }

    public post<T>(url: string) {

        return (body?: any) => fetch(`${config.url.api}${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: app.auth.token, ...body })
        }).then(res => res.json()).then(res => {
            if (!res.error) return res
            this.showErrors(res)
            return Promise.reject(res)
        }) as Promise<T>;
    }

    public showErrors(error: any) {
        if (error.reason === "Ended") return modals.ENDED.render()
        if (error.reason === "Banned") return modals.BANNED.render()
    }

    public get<T>(url: string) {
        return fetch(`${config.url.api}${url}`).then(res => res.json()) as Promise<T>;
    }

}