import { createContext } from "preact";
import { computed, signal } from "@preact/signals";
import { ApiInfo } from "../interfaces/Info";
import { AppFetch } from "../types/AppFetch";




export const InfoManager = {
    info: signal({} as ApiInfo),
    end() {
        InfoManager.info.value.ended = true
    },
    async fetch() {
        const info = await AppFetch.info()

        InfoManager.info.value = {
            ...info,
            cooldown: info.cooldown
        }

        return info
    }
}



export const InfoContext = createContext({} as typeof InfoManager)



