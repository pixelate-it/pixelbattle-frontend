import { config } from "../config"
import { Settings } from "../interfaces/Settings"
import { FlatPalette, PaletteManager } from "../managers/palette"
import { AppColor } from "./AppColor"

type Palette = typeof config.defaults.colors.palette

interface LocalStorageMap {
    palette: Palette;
    settings: Settings;
}

export class AppLocalStorage {
    public static set<K extends keyof LocalStorageMap>(
            key: K, 
            value: LocalStorageMap[K], 
            serialize: (value: LocalStorageMap[K]) => string = JSON.stringify) {

        localStorage.setItem(key, serialize(value))
    }

    public static get<K extends keyof LocalStorageMap>(
            key: K, 
            deserialize: (str: string) => LocalStorageMap[K] = JSON.parse): LocalStorageMap[K] | undefined {
        const item = localStorage.getItem(key)

        return item ? deserialize(item) : undefined;
    }

    public static reset<K extends keyof LocalStorageMap>(key: K): void {
        localStorage.removeItem(key)
    }
}