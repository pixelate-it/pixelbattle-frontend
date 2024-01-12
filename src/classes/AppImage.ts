import { Point } from "@pixi/math"
import { AppColor } from "./AppColor";

export class AppImage {
    private _buffer: Uint8Array;
    private _size: Point;
    private imagePixelDataSize = 3;
    private bufferPixelDataSize = 4;

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


        const pixelDataOffset = dataView.getUint32(10, true);
        const numPixels = width * height;
        const pixelData = new Uint8Array(numPixels * this.bufferPixelDataSize);

        for (let row = height - 1; row >= 0; row--) {
            for (let col = 0; col < width; col++) {
                const imageByteOffset = pixelDataOffset + (row * width + col) * this.imagePixelDataSize;
                const offset = (height - 1 - row) * width + col;


                pixelData[offset * this.bufferPixelDataSize + 0] = dataView.getUint8(imageByteOffset + 2);
                pixelData[offset * this.bufferPixelDataSize + 1] = dataView.getUint8(imageByteOffset + 1);
                pixelData[offset * this.bufferPixelDataSize + 2] = dataView.getUint8(imageByteOffset + 0);
                pixelData[offset * this.bufferPixelDataSize + 3] = 255;
            }
        }


        this._size = new Point(width, height);
        this._buffer = pixelData;
    }


    get buffer(): Uint8Array {
        return this._buffer;
    }

    public getPixel(point: Point): AppColor {
        const index = (point.x + point.y * this._size.x)
        const [r, g, b, a] = this._buffer.slice(index * this.bufferPixelDataSize, index * this.bufferPixelDataSize + this.bufferPixelDataSize);

        return new AppColor(new Uint8Array([r, g, b, a]));
    }


    public setPixel(point: Point, color: AppColor): void {
        const startIndex = (point.x + point.y * this._size.x) * this.bufferPixelDataSize;
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
