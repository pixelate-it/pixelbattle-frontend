import { createContext } from "preact";
import { Signal, computed, signal } from "@preact/signals";
import { InfoManager } from "./info";


export const CooldownManager = {
    cooldown: signal(0),
    interval: signal(setTimeout(() => {}, 0)) as Signal<NodeJS.Timeout>,
    hasCooldown: computed(() => false),
    start() {
        CooldownManager.interval.value = setInterval(CooldownManager.update, InfoManager.info.peek().cooldown / 100)
    },
    update() {
        if (CooldownManager.cooldown.value >= 100) {
            clearInterval(CooldownManager.interval.value)
            CooldownManager.cooldown.value = 0

            return
        }

        CooldownManager.cooldown.value += 1
    }
}

CooldownManager.hasCooldown = computed(() => CooldownManager.cooldown.value > 0)

export const CooldownContext = createContext({} as typeof CooldownManager)
