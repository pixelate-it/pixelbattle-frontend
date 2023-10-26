import { Context, createContext } from "preact";
import { MyColor } from "../types/color";
import { Signal, signal } from "@preact/signals";
import { config } from "../config";

export interface PaletteProps {
    selected: MyColor;
    colors: MyColor[];
}

export interface PaletteContextProps {
    palette: Signal<PaletteProps>;
    addAndSelect(color: MyColor): void;
    setCurrentColor: (color: MyColor) => void;
    removeColor: (color: MyColor) => void;
    addColor: (color: MyColor) => void;
}

export const PaletteContext = createContext<PaletteContextProps>({} as PaletteContextProps)
export const PaletteSignal = {
        palette: signal(config.colors.palette),
        setCurrentColor: (color: MyColor) => {
            PaletteSignal.palette.value = {
                ...PaletteSignal.palette.value,
                selected: color
            }
        },
        removeColor(color: MyColor) {
            PaletteSignal.palette.value = {
                selected: PaletteSignal.palette.value.colors.at(-1),
                colors: PaletteSignal.palette.value.colors.filter(c => !c.equals(color))
            }
        },
        addColor(color: MyColor) {
            PaletteSignal.palette.value = {
                ...PaletteSignal.palette.value,
                colors: [...PaletteSignal.palette.value.colors, color]
            }
        },
        addAndSelect(color: MyColor) {
            const isColorInPalette = PaletteSignal.palette.value.colors.some(c => c.equals(color))

            if (!isColorInPalette) {
                this.addColor(color)
            } 
            
            this.setCurrentColor(color)
        }
}



