import { Context, createContext } from "preact";
import { AppColor } from "../types/AppColor";
import { Signal, signal } from "@preact/signals";
import { AppBuffer } from "../types/AppImage";
import { Point } from "pixi.js";
import { config } from "../config";
import { ApiPixels } from "../interfaces/Pixels";
import { MyFetch } from "../types/AppFetch";

export const PlaceManager = {
    image: signal({} as AppBuffer),
    coordinates: signal({} as Point),
    async fetch() {
        const response = await MyFetch.place()
        response.pixels.map(pixel => {
            PlaceManager.image.value.setPixel(pixel.id, new AppColor(pixel.color.toLowerCase()))
        })
    },
    create(size: Point) {
        PlaceManager.image.value = new AppBuffer(size)
    },
    setCoordinates(point: Point) {
        PlaceManager.coordinates.value = point;
    },
}


export const PlaceContext = createContext({} as typeof PlaceManager)




