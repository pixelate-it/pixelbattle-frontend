import { signal } from "@preact/signals";
import { createContext } from "preact/compat";

export const ColorPickerManager = {
    isEnabled: signal(false),
    toggle() {
        ColorPickerManager.isEnabled.value = !ColorPickerManager.isEnabled.value
    }
}

export const ColorPickerContext = createContext({} as typeof ColorPickerManager);