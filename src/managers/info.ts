import { createContext } from "preact";
import { computed, signal } from "@preact/signals";
import { ApiInfo } from "../interfaces/Info";
import { MyFetch } from "../types/AppFetch";




export const InfoManager = {
    info: signal({} as ApiInfo),
    gameEnded: computed(() => false),
    end() {
        InfoManager.info.value.name = "season:blank"
    },
    async fetch() {
        InfoManager.info.value = await MyFetch.info()
    }
}


InfoManager.gameEnded = computed(() => (InfoManager.info.value.name === "season:blank"))

export const InfoContext = createContext({} as typeof InfoManager)



