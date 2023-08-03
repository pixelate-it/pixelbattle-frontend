import { Color, Point } from "pixi.js";

export function getRandomColor(): Color {
    return new Color(Math.floor(Math.random() * 0xffffff))
}

export function getRandomBuffer(size: Point) {
    const buffer = new Uint8Array(size.x * size.y * 4);

    for (let i = 0; i < buffer.length; i += 4) {
        const randomColor = getRandomColor();
        const rgbaColor = randomColor.toUint8RgbArray()

        buffer[i] = rgbaColor[0];
        buffer[i + 1] = rgbaColor[1];
        buffer[i + 2] = rgbaColor[2];
        buffer[i + 3] = 255;
    }

    return buffer;
}

export function getRandomId() {
    return Math.random().toString(32).slice(0, 8);
}