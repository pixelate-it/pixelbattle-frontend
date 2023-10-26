import { Context, createContext } from "preact";
import { MyColor } from "../types/color";
import { Signal, signal } from "@preact/signals";
import { config } from "../config";
import { PlaceSignal } from "./place";
import { MyBuffer } from "../types/buffer";
import { Point } from "pixi.js";
import { ApiInfo } from "../interfaces/Info";



export interface InfoContextProps {
    info: Signal<ApiInfo>;
    fetch(): Promise<void>;
}


export const InfoContext = createContext({} as InfoContextProps)
export const InfoSignal = {
    info: signal({} as ApiInfo),
    fetch() {
        return fetch(config.url.api + "/info")
            .then((res) => res.json())
            .then((res: ApiInfo) => {
                PlaceSignal.image.value = new MyBuffer(new Point(res.size.width, res.size.height))

                InfoSignal.info.value = res;
            })
    },
}



