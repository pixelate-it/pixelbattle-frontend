import { Color } from "pixi.js";

export function colorsEqual(a: Color, b: Color) {
    return a.toNumber() === b.toNumber();
}