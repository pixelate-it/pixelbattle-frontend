import { createContext } from "preact";
import { computed, signal } from "@preact/signals";
import { ApiInfo } from "../interfaces/Info";
import { MyFetch } from "../types/AppFetch";




export const InfoManager = {
    info: signal({} as ApiInfo),
    end() {
        InfoManager.info.value.ended = true
    },
    async fetch() {
        const info = await MyFetch.info()

        InfoManager.info.value = {
            ...info,
            cooldown: info.cooldown + 50
        }

        return info
    }
}



export const InfoContext = createContext({} as typeof InfoManager)



