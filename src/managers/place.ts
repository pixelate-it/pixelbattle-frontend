import { Context, createContext } from "preact";
import { AppColor } from "../types/AppColor";
import { Signal, signal } from "@preact/signals";
import { AppImage } from "../types/AppImage";
import { Point } from "pixi.js";
import { config } from "../config";
import { AppFetch } from "../types/AppFetch";
import { PlaceContainer } from "../components/Place/PlaceContainer";

export const PlaceManager = {
    image: signal({} as AppImage),
    container: signal({} as PlaceContainer),
    async fetch() {
        const image = await AppFetch.pixels()

        PlaceManager.image.value = new AppImage(image)

    },
}


export const PlaceContext = createContext({} as typeof PlaceManager)




