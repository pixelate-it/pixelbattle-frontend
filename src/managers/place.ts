import { Context, createContext } from "preact";
import { MyColor } from "../types/MyColor";
import { Signal, signal } from "@preact/signals";
import { MyBuffer } from "../types/MyBuffer";
import { Point } from "pixi.js";
import { config } from "../config";
import { ApiPixels } from "../interfaces/Pixels";
import { MyFetch } from "../types/MyFetch";

export const PlaceManager = {
    image: signal({} as MyBuffer),
    coordinates: signal({} as Point),
    async fetch() {
        const response = await MyFetch.place()
        response.pixels.map(pixel => {
            PlaceManager.image.value.setPixel(pixel.id, new MyColor(pixel.color.toLowerCase()))
        })
    },
    create(size: Point) {
        PlaceManager.image.value = new MyBuffer(size)
    },
    setCoordinates(point: Point) {
        PlaceManager.coordinates.value = point;
    },
}


export const PlaceContext = createContext({} as typeof PlaceManager)




