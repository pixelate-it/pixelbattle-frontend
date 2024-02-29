import { Point } from "@pixi/math";
import { AppColor } from "./AppColor";

export class AppImage {
    private _buffer!: Uint8ClampedArray;
    private _size!: Point;

    constructor(
        private readonly _raw: ArrayBuffer,
        private readonly bufferPixelDataSize: number = 4
    ) {}

    async process() {
        const bitmap = await createImageBitmap(new Blob([ this._raw ]));
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(bitmap, 0, 0);

        this._size = new Point(bitmap.width, bitmap.height);
        this._buffer = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
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
