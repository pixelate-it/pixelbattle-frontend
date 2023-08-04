import { Color, Point } from "pixi.js";

export function getRandomId() {
    return Math.random().toString(32).slice(0, 8);
}