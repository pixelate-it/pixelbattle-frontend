import { createContext } from "preact";
import { Signal, signal } from "@preact/signals";
import { AppImage, imageFormat } from "../classes/AppImage";
import { AppFetch } from "../classes/AppFetch";
import { PlaceContainer } from "../components/Place/PlaceContainer";

export const PlaceManager = {
    image: signal(null) as Signal<null | AppImage>,
    container: signal({} as PlaceContainer),
    async fetch() {
        const image = await AppFetch.pixels();

        PlaceManager.image.value = await new AppImage(image, imageFormat.RGB).process();
    },
}


export const PlaceContext = createContext({} as typeof PlaceManager);