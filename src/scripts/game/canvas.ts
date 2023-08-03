import { Color, ColorSource, Container, FederatedPointerEvent, Graphics, Point, Sprite, Texture } from "pixi.js";
import { config } from "../config";
import { WHITE_TEXTURE } from "../lib/texture";
import { app } from "../app";
import { Modal } from "../api/modal";
import { pointToIndex } from "../lib/coords";
import { modals } from "../lib/modals";
import { colorsEqual } from "../lib/colors";


export class Canvas extends Container {
    private currentPixel: Sprite;
    private place: Sprite;
    private image: Uint8Array;
    public isDragged = false;

    constructor() {
        super();
        this.place = new Sprite(WHITE_TEXTURE);
        this.setup();
    }

    public loadImage(image: Uint8Array) {
        this.place.texture = Texture.fromBuffer(image, config.size.width, config.size.height);
        this.image = image
    }

    private setup() {
        this.eventMode = "static"

        this.currentPixel = new Sprite(WHITE_TEXTURE);
        this.currentPixel.anchor.set(0.5, 0.5);

        const border = new Graphics()
            .lineStyle(0.1, 0x000000)
            .drawRect(0, 0, 1, 1)
        border.transform.position.set(-0.5, -0.5)

        this.currentPixel.addChild(border)

        this.addChild(this.place, this.currentPixel);

        this.on("pointermove", this.onPointerMove.bind(this));
        this.on("pointerout", this.onPointerOut.bind(this));
        this.on("pointerup", this.onClick.bind(this));
    }


    private async onClick(event: FederatedPointerEvent) {
        if (this.isDragged) return;
        const position = event.getLocalPosition(this)
        const x = Math.floor(position.x)
        const y = Math.floor(position.y)
        const point = new Point(x, y)

        if (!app.auth.token) {
            return modals.NOT_AUTH.render()
        }

        if (app.info.hasEnded) 
            return modals.ENDED.render()

        if (event.button === 0) 
            return this.placeOwnPixel(point)

        if (event.button === 2) {
            const color = this.getPixelColor(point)
            const colorInPalette = app.palette.colors
                .find(c => colorsEqual(c.color, color))     

            if (colorInPalette) {
                return app.palette.setSelectedColor(colorInPalette.id)
            }

            return app.palette.addColor(color)
        }

    }

    private async placeOwnPixel(point: Point) {
        try {
            const color = app.palette.selectedColor.color;

            await app.request.post("/pixels/put")({
                id: pointToIndex(point),
                color: color.toHex(),
            })
            this.setSquare(point, color)
        } catch {}
    }

    private onPointerMove(event: FederatedPointerEvent) {
        const position = event.getLocalPosition(this)
        if (position.x < 0 || position.x > config.size.width || position.y < 0 || position.y > config.size.height) return

        const x = Math.floor(position.x)
        const y = Math.floor(position.y)
        const color = this.getPixelColor(new Point(x, y))

        this.currentPixel.visible = true
        this.currentPixel.position.set(x + 0.5, y + 0.5)
        this.currentPixel.scale.set(1.2)
        this.currentPixel.tint = new Color(color)
    }

    public getPixelColor(point: Point) {
        return new Color(this.image.slice(pointToIndex(point) * 4, pointToIndex(point) * 4 + 4))    
    }

    private onPointerOut(event: PointerEvent) {
        this.currentPixel.visible = false
        this.currentPixel.scale.set(1, 1)

    }

    public setSquare(pos: Point, color: Color) {
        const startIndex = (pos.x + pos.y * config.size.width) * 4
        const rgbaColor = color.toUint8RgbArray().concat([255])

        this.image[startIndex] = rgbaColor[0];
        this.image[startIndex + 1] = rgbaColor[1];
        this.image[startIndex + 2] = rgbaColor[2];
        this.image[startIndex + 3] = rgbaColor[3];

        this.place.texture.update()
    }
}