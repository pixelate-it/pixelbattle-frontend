import { createContext } from "preact";
import { Signal, computed, signal } from "@preact/signals";
import { ApiInfo } from "../interfaces/Info";
import { AppFetch } from "../classes/AppFetch";




export const InfoManager = {
    info: signal(null) as Signal<null | ApiInfo>,
    end() {
        if (InfoManager.info.value === null) {
            return
        }

        InfoManager.info.value = {
            ...InfoManager.info.value,
            ended: true
        }
    },
    start() {
        if (InfoManager.info.value === null) {
            return
        }


        InfoManager.info.value = {
            ...InfoManager.info.value,
            ended: false
        }
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



