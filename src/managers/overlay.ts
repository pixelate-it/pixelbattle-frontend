import { createContext } from "preact";
import { Signal, computed, signal } from "@preact/signals";
import { ApiInfo } from "../interfaces/Info";
import { AppFetch } from "../classes/AppFetch";
import { Point } from "@pixi/math";
import { AppImage } from "../classes/AppImage";
import { AppLocalStorage } from "../classes/AppLocalStorage";
import { config } from "../config";


function arrayBufferToString(buffer: ArrayBuffer): string {
    return String.fromCharCode(...new Uint8ClampedArray(buffer));
}

function stringToArrayBuffer(str: string): ArrayBuffer {
    return new Uint8ClampedArray(str.split('').map(c => c.charCodeAt(0))).buffer;
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


        OverlayManager.save()
    },
    unsetImage() {
        OverlayManager.image.value = null;
        OverlayManager.imageName.value = null;
        OverlayManager.position.value = null;
        OverlayManager.opacity.value = null;

        OverlayManager.save()
    },
    save() {
        if (!OverlayManager.isSet.value) {
            AppLocalStorage.reset("overlay")
            return;
        }

        AppLocalStorage.set(
            "overlay",
            {
                data: arrayBufferToString(OverlayManager.image.value!.raw),
                name: OverlayManager.imageName.value!,
                position: {
                    x: OverlayManager.position.value!.x,
                    y: OverlayManager.position.value!.y
                },
                opacity: OverlayManager.opacity.value!
            }
        )
    },
    load() {
        const localStorageOverlay = AppLocalStorage.get("overlay")

        if (!localStorageOverlay)
            return;


        OverlayManager.image.value = new AppImage(stringToArrayBuffer(localStorageOverlay.data), 4);
        OverlayManager.position.value = new Point(localStorageOverlay.position.x, localStorageOverlay.position.y)
        OverlayManager.imageName.value = localStorageOverlay.name;
        OverlayManager.opacity.value = localStorageOverlay.opacity;
    }
}

OverlayManager.isSet = computed(() => OverlayManager.image.value !== null)


export const OverlayContext = createContext({} as typeof OverlayManager);