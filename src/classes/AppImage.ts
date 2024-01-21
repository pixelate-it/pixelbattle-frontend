import { Point } from "@pixi/math"
import { AppColor } from "./AppColor";
import { DecodedPng, PngDataArray, decode } from "fast-png";

export class AppImage {
    private _buffer: Uint8Array;
    private _size: Point;
    private imagePixelDataSize = 3;
    private bufferPixelDataSize = 4;

    get size() {
        return this._size;
    }

    /**
     * Add alpha channel to the image with 3 channels
     * @param decodedBuffer 
     */
    private convert3ChannelTo4Channel(decodedBuffer: DecodedPng) {
        const numPixels = decodedBuffer.width * decodedBuffer.height;
        const pixelData = new Uint8Array(numPixels * this.bufferPixelDataSize);

        for (let row = 0; row < decodedBuffer.height; row++) {
            for (let col = 0; col < decodedBuffer.width; col++) {
                const imageByteOffset = (row * decodedBuffer.width + col) * this.imagePixelDataSize;
                const offset = row * decodedBuffer.width + col;

                pixelData[offset * this.bufferPixelDataSize + 0] = decodedBuffer.data[imageByteOffset + 0];
                pixelData[offset * this.bufferPixelDataSize + 1] = decodedBuffer.data[imageByteOffset + 1];
                pixelData[offset * this.bufferPixelDataSize + 2] = decodedBuffer.data[imageByteOffset + 2];
                pixelData[offset * this.bufferPixelDataSize + 3] = 255;
            }
        }

        return pixelData
    }

    constructor(buffer: ArrayBuffer) {
        const decodedBuffer = decode(buffer)


        this._size = new Point(decodedBuffer.width, decodedBuffer.height);
        this._buffer = this.convert3ChannelTo4Channel(decodedBuffer);
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
}
