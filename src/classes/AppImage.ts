import { Point } from "@pixi/math";
import { AppColor } from "./AppColor";
import { decode } from "fast-png";

export class AppImage {
    private _buffer: Uint8ClampedArray;
    private _size: Point;
    private _raw: ArrayBuffer;
    private bufferPixelDataSize: number;

    constructor(buffer: ArrayBuffer, bufferPixelDataSize: number = 3) {
        this.bufferPixelDataSize = bufferPixelDataSize;
        this._raw = buffer;

        const decodedBuffer = decode(buffer);

        this._size = new Point(decodedBuffer.width, decodedBuffer.height);
        this._buffer = decodedBuffer.data as Uint8ClampedArray;
    }

    get raw() {
        return this._raw;
    }

    get buffer() {
        return this._buffer;
    }

    get size() {
        return this._size;
    }

    public getPixel(point: Point): AppColor {
        const index = point.x + point.y * this._size.x;
        const [r, g, b, ...rest] = this._buffer.slice(index * this.bufferPixelDataSize, index * this.bufferPixelDataSize + this.bufferPixelDataSize);
        
        return new AppColor(new Uint8Array([r, g, b, rest.length === 0 ? 255 : rest[0]]));
    }


    public setPixel(point: Point, color: AppColor): void {
        const startIndex = (point.x + point.y * this._size.x) * this.bufferPixelDataSize;
        const [r, g, b] = color.toUint8RgbArray();

        this._buffer[startIndex] = r;
        this._buffer[startIndex + 1] = g;
        this._buffer[startIndex + 2] = b;
    }
}
