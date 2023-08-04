import { Color, ColorSource, Container, FederatedPointerEvent, Graphics, Point, Sprite, Texture } from "pixi.js";
import { config } from "../config";
import { WHITE_TEXTURE } from "../lib/texture";
import { app } from "../app";
import { modals } from "../lib/modals";
import { Pointer } from "./pointer";
import { MyColor } from "../types/color";
import { MyBuffer } from "../types/buffer";


export class Canvas extends Container {
    private pointer: Pointer;
    private place: Sprite;

    public buffer: MyBuffer;
    public isDragged = false;

    constructor() {
        super();
        this.place = new Sprite(WHITE_TEXTURE);
        this.setup();
    }

    public loadImage(image: MyBuffer) {
        this.place.texture = Texture.fromBuffer(image.buffer, config.size.x, config.size.y);
        this.buffer = image
    }

    private setup() {
        this.eventMode = "static"
        this.pointer = new Pointer()

        this.addChild(this.place, this.pointer);

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


        if (event.button === 0) {
            if (app.info.cooldown.isInProcess) return this.pointer.shake()

            return this.placeOwnPixel(point)
        }


        if (event.button === 2) {
            const color = this.buffer.getPixel(point)
            const colorInPalette = app.palette.colors
                .find(c => c.color.equals(color))     

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
                id: this.buffer.pointToIndex(point),
                color: color.toHex(),
            })
            this.setSquare(point, color)
            app.info.cooldown.start()
        } catch {}
    }

    private onPointerMove(event: FederatedPointerEvent) {
        const position = event.getLocalPosition(this)
        const { x: width, y: height } = config.size

        if (position.x < 0 
            || position.x > width 
            || position.y < 0 
            || position.y > height) return

        const point = new Point(Math.floor(position.x), Math.floor(position.y))
        this.pointer.hover(point);
    }

    private onPointerOut(event: PointerEvent) {
        this.pointer.out()
    }

    public setSquare(pos: Point, color: MyColor) {
        this.buffer.setPixel(pos, color)
        this.place.texture.update()
        this.pointer.background.tint = color
    }
}