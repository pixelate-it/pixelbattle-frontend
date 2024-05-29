import { createContext } from "preact";
import { signal } from "@preact/signals";
import { AppColor } from "../classes/AppColor";

export const CursorManager = {
    color: signal(new AppColor('#FFFFFF')),
    setColor(color: AppColor) {
        CursorManager.color.value = color;
    }
}

export const CursorContext = createContext({} as typeof CursorManager);