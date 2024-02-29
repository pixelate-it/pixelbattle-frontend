import { createContext } from "preact";
import { Signal, signal } from "@preact/signals";
import { AppImage } from "../classes/AppImage";
import { AppFetch } from "../classes/AppFetch";
import { PlaceContainer } from "../components/Place/PlaceContainer";

export const PlaceManager = {
    image: signal(null) as Signal<null | AppImage>,
    container: signal({} as PlaceContainer),
    async fetch() {
        const image = await AppFetch.pixels();

        PlaceManager.image.value = new AppImage(image, 4);
        await PlaceManager.image.value.process();
    },
}


export const PlaceContext = createContext({} as typeof PlaceManager);