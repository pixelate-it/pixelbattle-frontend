import { createContext } from "preact";
import { AppColor } from "../classes/AppColor";
import { signal } from "@preact/signals";
import { config } from "../config";

export const PaletteManager = {
    palette: signal(config.defaults.colors.palette),
    setCurrentColor: (color: AppColor) => {
        PaletteManager.palette.value = {
            ...PaletteManager.palette.value,
            selected: color
        }

        PaletteManager.save()
    },
    removeColor(color: AppColor) {
        PaletteManager.palette.value = {
            selected: PaletteManager.palette.value.colors.at(-2) ?? PaletteManager.palette.value.selected,
            colors: PaletteManager.palette.value.colors.filter(c => !c.equals(color))
        }

        PaletteManager.save()
    },
    isDefaultColor(color: AppColor) {
        return config.defaults.colors.palette.colors.some(c => c.equals(color))
    },
    addColor(color: AppColor) {
        PaletteManager.palette.value = {
            ...PaletteManager.palette.value,
            colors: [...PaletteManager.palette.value.colors, color]
        }

        PaletteManager.save()
    },
    addAndSelect(color: AppColor) {
        const isColorInPalette = PaletteManager.palette.value.colors.some(c => c.equals(color))

        if (!isColorInPalette) {
            this.addColor(color)
        } 
        
        this.setCurrentColor(color)
        
        PaletteManager.save()
    },
    save() {
        const flatPalette: FlatPalette = {
            colors: PaletteManager.palette.value.colors.map(c => c.toHexa()),
            selected: PaletteManager.palette.value.selected.toHexa()
        }

        localStorage.setItem("palette", JSON.stringify(flatPalette))
    },
    load() {
        const palette = localStorage.getItem("palette")
        if (!palette) return

        const flatPalette = JSON.parse(palette) as FlatPalette

        PaletteManager.palette.value = {
            colors: flatPalette.colors.map(c => new AppColor(c)),
            selected: new AppColor(flatPalette.selected)
        }
    },

}

export const PaletteContext = createContext({} as typeof PaletteManager)


export interface FlatPalette {
    colors: string[]
    selected: string
}

