import { Point } from "@pixi/math";
import { AppColor } from "./AppColor";

export enum ImageFormat {
    RGB = 3,
    RGBA = 4
}

export class AppImage {
    private _buffer!: Uint8ClampedArray;
    private _size!: Point;

    constructor(
        private readonly _raw: Blob,
        private readonly bufferPixelDataSize: ImageFormat = ImageFormat.RGBA
    ) {}

    private convertRGBAtoRGB(DATA_RGBA: Uint8ClampedArray, { x, y }: Point) {
        const DATA_RGB = new Uint8ClampedArray(x * y * ImageFormat.RGB);
        for(let i = 0, j = 0; i < DATA_RGBA.length; i += 4, j += 3) {
            DATA_RGB[j] = DATA_RGBA[i];
            DATA_RGB[j + 1] = DATA_RGBA[i + 1];
            DATA_RGB[j + 2] = DATA_RGBA[i + 2];
        }

        return DATA_RGB;
    }

    async process() {
        const bitmap = await createImageBitmap(this._raw);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        ctx.drawImage(bitmap, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        this._size = new Point(bitmap.width, bitmap.height);
        this._buffer = this.bufferPixelDataSize === ImageFormat.RGB
            ? this.convertRGBAtoRGB(imageData, this._size)
            : imageData;

        return this;
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
