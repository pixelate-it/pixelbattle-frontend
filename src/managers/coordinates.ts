import { createContext } from "preact";
import { Signal, computed, signal } from "@preact/signals";
import { Point } from "pixi.js";
import { ApiPixel, PixelInfo } from "../interfaces/Pixels";
import { AppFetch } from "../types/AppFetch";



export const CoordinatesManager = {
    coordinates: signal(new Point(-1, -1)),
    areCoordinatesSet: computed(() => false),
    info: signal(null as PixelInfo | null | "loading"),
    async fetchInfo() {
        CoordinatesManager.info.value = await AppFetch.getPixel(CoordinatesManager.coordinates.value)
    },
    setCoordinates(point: Point) {
        CoordinatesManager.coordinates.value = point
    },
    removeCoordinates() {
        CoordinatesManager.coordinates.value = new Point(-1, -1)
    },
}

CoordinatesManager.areCoordinatesSet = computed(() => CoordinatesManager.coordinates.value.x !== -1)

export const CoordinatesContext = createContext({} as typeof CoordinatesManager)




