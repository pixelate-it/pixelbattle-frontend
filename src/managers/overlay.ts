import { createContext } from "preact";
import { Signal, computed, signal } from "@preact/signals";
import { Point } from "@pixi/math";
import { AppImage } from "../classes/AppImage";
import { AppLocalStorage } from "../classes/AppLocalStorage";
import { config } from "../config";


async function blobToString(image: Blob): Promise<string> {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            if(typeof reader.result === 'string') {
                resolve(reader.result);
            } else reject();
        }

        reader.onerror = () => reject();

        reader.readAsDataURL(image);
    });
}

async function stringToBlob(str: string): Promise<Blob> {
    const fetchResponse = await fetch(str);
    return fetchResponse.blob();
}

export const OverlayManager = {
    image: signal(null) as Signal<AppImage | null>,
    imageName: signal(null) as Signal<string | null>,
    position: signal(null) as Signal<Point | null>,
    opacity: signal(null) as Signal<number | null>,
    isSet: computed(() => false),
    setImage(image: AppImage, imageName: string, position: Point) {
        OverlayManager.image.value = image;
        OverlayManager.imageName.value = imageName;
        OverlayManager.position.value = position;
        OverlayManager.opacity.value = config.overlay.defaultOpacity;


        OverlayManager.save();
    },
    unsetImage() {
        OverlayManager.image.value = null;
        OverlayManager.imageName.value = null;
        OverlayManager.position.value = null;
        OverlayManager.opacity.value = null;

        OverlayManager.save();
    },
    async save() {
        if (!OverlayManager.isSet.value) {
            AppLocalStorage.reset("overlay");
            return;
        }

        AppLocalStorage.set(
            "overlay",
            {
                data: await blobToString(OverlayManager.image.value!.raw),
                name: OverlayManager.imageName.value!,
                position: {
                    x: OverlayManager.position.value!.x,
                    y: OverlayManager.position.value!.y
                },
                opacity: OverlayManager.opacity.value!
            }
        );
    },
    async load() {
        const localStorageOverlay = AppLocalStorage.get("overlay");

        if (!localStorageOverlay)
            return;

        OverlayManager.image.value = await new AppImage(await stringToBlob(localStorageOverlay.data)).process();
        OverlayManager.position.value = new Point(localStorageOverlay.position.x, localStorageOverlay.position.y)
        OverlayManager.imageName.value = localStorageOverlay.name;
        OverlayManager.opacity.value = localStorageOverlay.opacity;
    }
}

OverlayManager.isSet = computed(() => OverlayManager.image.value !== null);


export const OverlayContext = createContext({} as typeof OverlayManager);