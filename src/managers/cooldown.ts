import { createContext } from "preact";
import { Signal, computed, signal } from "@preact/signals";
import { InfoManager } from "./info";
import { ProfileManager } from "./profile";
import { config } from "../config";

// const updateInterval = 10
export const CooldownManager = {
    progress: signal(0),
    reqId: signal(0),
    startTime: signal(0),
    hasCooldown: computed(() => false),
    start() {
        CooldownManager.startTime.value = performance.now();
        CooldownManager.reqId.value = requestAnimationFrame(CooldownManager.update)
    },
    update(time: number) {
        const currentTime = time - CooldownManager.startTime.value;

        if (InfoManager.info.value === null) {
            return
        }

        const cooldownDuration = ProfileManager.isMod.value 
            ? config.time.modCooldown
            : InfoManager.info.value.cooldown

        const progress = currentTime / cooldownDuration;


        if (progress >= 1) {
            CooldownManager.progress.value = 0
            cancelAnimationFrame(CooldownManager.reqId.value)
            return 
        }

        CooldownManager.progress.value = progress * 100


        requestAnimationFrame(CooldownManager.update);
    }
}
CooldownManager.hasCooldown = computed(() => {
    // console.log(CooldownManager.cooldown.value)
    // console.log(CooldownManager.time - new Date().getTime())
    return CooldownManager.progress.value > 0
})

export const CooldownContext = createContext({} as typeof CooldownManager)
