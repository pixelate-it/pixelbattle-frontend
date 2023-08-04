import { Point } from "pixi.js";
import { MyColor } from "./color";

export class MyBuffer {
    private _buffer: Uint8Array;
    private size: Point;

    constructor(size: Point) {
        this._buffer = new Uint8Array(size.x * size.y * 4);
        this.size = size;
    }

    get buffer(): Uint8Array {
        return this._buffer;    
    }

    public indexToPoint(index: number): Point {
        return new Point(index % this.size.x, index / this.size.x);
    }

    public pointToIndex(point: Point): number {
        return point.x + point.y * this.size.x;
    }

    getPixel(point: Point): MyColor | undefined;
    getPixel(index: number): MyColor | undefined;
    public getPixel(pointOrIndex: Point | number): MyColor | undefined {
        if (typeof pointOrIndex === "number") {
            return this.getPixelByIndex(pointOrIndex);
        }
        
        return this.getPixelByPoint(pointOrIndex);
    }


    private getPixelByIndex(index: number) {
        const [r, g, b, a] = this._buffer.slice(index * 4, index * 4 + 4);

        return new MyColor([r, g, b, a]);
    }

    private getPixelByPoint(point: Point) {
        return this.getPixelByIndex(point.x + point.y * this.size.x);
    }


    setPixel(point: Point, color: MyColor): void;
    setPixel(index: number, color: MyColor): void;
    public setPixel(pointOrIndex: Point | number, color: MyColor): void {
        if (typeof pointOrIndex === "number") {
            return this.setPixelByIndex(pointOrIndex, color);
        }

        return this.setPixelByPoint(pointOrIndex, color);
    }

    private setPixelByPoint(point: Point, color: MyColor) {
        this.setPixelByIndex(point.x + point.y * this.size.x, color);
    }

    private setPixelByIndex(index: number, color: MyColor) {
        const startIndex = index * 4;
        const [r, g, b] = color.toUint8RgbArray();

        this._buffer[startIndex] = r;
        this._buffer[startIndex + 1] = g;
        this._buffer[startIndex + 2] = b;
        this._buffer[startIndex + 3] = 255;
    }

    static getRandom(size: Point) {
        const buffer = new MyBuffer(size);

        for (let x = 0; x < size.x; x++) {
            for (let y = 0; y < size.y; y++) {
                buffer.setPixel(new Point(x, y), MyColor.getRandom());
            }            
        }

        return buffer;
    }
}