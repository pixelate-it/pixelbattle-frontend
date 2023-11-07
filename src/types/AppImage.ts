import { Point } from "pixi.js";
import { AppColor } from "./AppColor";

export class AppImage {
    private _buffer: Uint8Array;
    private _size: Point;

    get size() {
        return this._size;
    }

    // set size(s: Point) {
    //     this._size = s;
    //     this._buffer = new Uint8Array(this.size.x * this.size.y * 4);
    // }

    constructor(buffer: ArrayBuffer) {
        const dataView = new DataView(buffer);
        const width = dataView.getUint32(18, true)
        const height = dataView.getUint32(22, true);
        const pixelDataSize = 4;


        const pixelDataOffset = dataView.getUint32(10, true);
        const numPixels = width * height;
        const pixelData = new Uint8Array(numPixels * pixelDataSize);

        for (let row = height - 1; row >= 0; row--) {
            for (let col = 0; col < width; col++) {
                const imageByteOffset = pixelDataOffset + (row * width + col) * pixelDataSize;
                const alpha = dataView.getUint8(imageByteOffset + 3);
                const red = dataView.getUint8(imageByteOffset + 2);
                const green = dataView.getUint8(imageByteOffset + 1);
                const blue = dataView.getUint8(imageByteOffset + 0);

                const offset = (height - 1 - row) * width + col;

                pixelData[offset * 4 + 0] = red;
                pixelData[offset * 4 + 1] = green;
                pixelData[offset * 4 + 2] = blue;
                pixelData[offset * 4 + 3] = alpha;
            }
        }



        this._size = new Point(width, height);
        this._buffer = pixelData;
    }


    get buffer(): Uint8Array {
        return this._buffer;
    }

    public getPixel(point: Point): AppColor | undefined {
        const index = (point.x + point.y * this._size.x)
        const [r, g, b, a] = this._buffer.slice(index * 4, index * 4 + 4);

        return new AppColor(new Uint8Array([r, g, b, a]));
    }


    public setPixel(point: Point, color: AppColor): void {
        const startIndex = (point.x + point.y * this._size.x) * 4;
        const [r, g, b] = color.toUint8RgbArray();

        this._buffer[startIndex] = r;
        this._buffer[startIndex + 1] = g;
        this._buffer[startIndex + 2] = b;
        this._buffer[startIndex + 3] = 255;
    }

    // static getRandom(size: Point) {
    //     const buffer = new AppImage(size);

    //     for (let x = 0; x < size.x; x++) {
    //         for (let y = 0; y < size.y; y++) {
    //             buffer.setPixel(new Point(x, y), AppColor.getRandom());
    //         }            
    //     }

    //     return buffer;
    // }
}
