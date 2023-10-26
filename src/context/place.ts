import { Context, createContext } from "preact";
import { MyColor } from "../types/color";
import { Signal, signal } from "@preact/signals";
import { MyBuffer } from "../types/buffer";
import { Point } from "pixi.js";
import { config } from "../config";
import { ApiPixels } from "../interfaces/Pixels";


export interface PlaceContextProps {
    image: Signal<MyBuffer>;
    fetch(): Promise<void>;
}


export const PlaceContext = createContext({} as PlaceContextProps)
export const PlaceSignal = {
    image: signal({} as MyBuffer),
    fetch() {
        return fetch(config.url.api + "/pixels/get")
            .then(res => res.json())
            .then(({ pixels }: ApiPixels) => {
                pixels.forEach((pixel) => {
                    const color = new MyColor(pixel.color.toLowerCase())

                    PlaceSignal.image.value.setPixel(pixel.id, color);
                })
            })
    }
}



