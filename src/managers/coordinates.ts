import { createContext } from "preact";
import { computed, signal } from "@preact/signals";
import { Point } from "pixi.js";
import { ApiPixel, PixelInfo } from "../interfaces/Pixels";
import { MyFetch } from "../types/AppFetch";



export const CoordinatesManager = {
    coordinates: signal(new Point(-1, -1)),
    areCoordinatesSet: computed(() => false),
    info: signal({} as PixelInfo),
    async fetchInfo() {
        CoordinatesManager.info.value = await MyFetch.getPixel(CoordinatesManager.coordinates.value)
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




