import { Point } from "pixi.js";
import { AppColor } from "./AppColor";

export class AppBuffer {
    private _buffer: Uint8Array;
    private _size: Point;

    get size() {
        return this._size;
    }

    set size(s: Point) {
        this._size = s;
        this._buffer = new Uint8Array(this.size.x * this.size.y * 4);
    }

    constructor(size: Point) {
        this._buffer = new Uint8Array(size.x * size.y * 4);
        this._size = size;
    }

    get buffer(): Uint8Array {
        return this._buffer;    
    }

    public indexToPoint(index: number): Point {
        return new Point(index % this._size.x, index / this._size.x);
    }

    public pointToIndex(point: Point): number {
        return point.x + point.y * this._size.x;
    }

    getPixel(point: Point): AppColor | undefined;
    getPixel(index: number): AppColor | undefined;
    public getPixel(pointOrIndex: Point | number): AppColor | undefined {
        if (typeof pointOrIndex === "number") {
            return this.getPixelByIndex(pointOrIndex);
        }
        
        return this.getPixelByPoint(pointOrIndex);
    }


    private getPixelByIndex(index: number) {
        const [r, g, b, a] = this._buffer.slice(index * 4, index * 4 + 4);


        return new AppColor(new Uint8Array([r, g, b, a]));
    }

    private getPixelByPoint(point: Point) {
        return this.getPixelByIndex(point.x + point.y * this._size.x);
    }


    setPixel(point: Point, color: AppColor): void;
    setPixel(index: number, color: AppColor): void;
    public setPixel(pointOrIndex: Point | number, color: AppColor): void {
        if (typeof pointOrIndex === "number") {
            return this.setPixelByIndex(pointOrIndex, color);
        }

        return this.setPixelByPoint(pointOrIndex, color);
    }

    private setPixelByPoint(point: Point, color: AppColor) {
        this.setPixelByIndex(point.x + point.y * this._size.x, color);
    }

    private setPixelByIndex(index: number, color: AppColor) {
        const startIndex = index * 4;
        const [r, g, b] = color.toUint8RgbArray();

        this._buffer[startIndex] = r;
        this._buffer[startIndex + 1] = g;
        this._buffer[startIndex + 2] = b;
        this._buffer[startIndex + 3] = 255;
    }

    static getRandom(size: Point) {
        const buffer = new AppBuffer(size);

        for (let x = 0; x < size.x; x++) {
            for (let y = 0; y < size.y; y++) {
                buffer.setPixel(new Point(x, y), AppColor.getRandom());
            }            
        }

        return buffer;
    }
}