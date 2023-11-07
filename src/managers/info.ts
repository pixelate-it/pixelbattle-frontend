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
        InfoManager.info.value = await MyFetch.info()
    }
}



export const InfoContext = createContext({} as typeof InfoManager)



