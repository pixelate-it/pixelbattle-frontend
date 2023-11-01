import { Context, createContext } from "preact";
import { MyColor } from "../types/MyColor";
import { ReadonlySignal, Signal, computed, signal } from "@preact/signals";
import { MyBuffer } from "../types/MyBuffer";
import { Point } from "pixi.js";
import { config } from "../config";
import { ApiPixels } from "../interfaces/Pixels";
import { InfoContext, InfoManager } from "./info";


export const CooldownManager = {
    cooldown: signal(0),
    interval: signal(setTimeout(() => {}, 0)) as Signal<NodeJS.Timeout>,
    hasCooldown: computed(() => false),
    start() {
        CooldownManager.interval.value = setInterval(CooldownManager.update, InfoManager.info.peek().cooldown / 100)
    },
    update() {
        console.log(CooldownManager.cooldown.value)
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
