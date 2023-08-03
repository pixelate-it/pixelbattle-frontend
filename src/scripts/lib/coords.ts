import { Point } from "pixi.js";
import { config } from "../config";

export function indexToPoint(index: number): Point {    
    const y = Math.floor(index / config.size.width);
    const x = index % config.size.width;

    return new Point(x, y);
}

export function pointToIndex(point: Point): number {
    return point.x + point.y * config.size.width;
}