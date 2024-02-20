import { Point } from "@pixi/math";
import { AppColor } from "./AppColor";
import { decode } from "fast-png";

export class AppImage {
    private _buffer: Uint8ClampedArray;
    private _size: Point;
    private bufferPixelDataSize = 3;

    get size() {
        return this._size;
    }

    constructor(buffer: ArrayBuffer) {
        const decodedBuffer = decode(buffer);

        this._size = new Point(decodedBuffer.width, decodedBuffer.height);
        this._buffer = decodedBuffer.data as Uint8ClampedArray;
    }


    get buffer(): Uint8ClampedArray {
        return this._buffer;
    }

    public getPixel(point: Point): AppColor {
        const index = (point.x + point.y * this._size.x);
        const [r, g, b] = this._buffer.slice(index * this.bufferPixelDataSize, index * this.bufferPixelDataSize + this.bufferPixelDataSize);

        return new AppColor(new Uint8Array([r, g, b, 255]));
    }


    public setPixel(point: Point, color: AppColor): void {
        const startIndex = (point.x + point.y * this._size.x) * this.bufferPixelDataSize;
        const [r, g, b] = color.toUint8RgbArray();

        this._buffer[startIndex] = r;
        this._buffer[startIndex + 1] = g;
        this._buffer[startIndex + 2] = b;
    }
}
