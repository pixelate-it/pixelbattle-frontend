import { AppColor } from "../../classes/AppColor";
import { PlaceManager } from "../../managers/place";
import { ColorPickerManager } from "../../managers/picker";
import { ALPHA_MODES, FORMATS, SCALE_MODES, TYPES, Texture } from "@pixi/core";
import { Point } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { FederatedPointerEvent } from "@pixi/events";


export class PlaceView extends Sprite {
    get image() {
        if (PlaceManager.image.value === null) {
            throw new Error("Can't find image")
        }
        return PlaceManager.image.value
    }

    get size() {
        if (PlaceManager.image.value === null) {
            throw new Error("Can't find image")
        }
        return PlaceManager.image.value.size
    }

    public isZommed = false;
    public isDragged = false;

    constructor() {
        super()


        this.setup()
    }

    private setup() {
        this.eventMode = "static";
    
        
        this.texture = Texture.fromBuffer(
            this.image.buffer,
            this.size.x,
            this.size.y,
            {
                resolution: 1,
                format: FORMATS.RGB,
                type: TYPES.UNSIGNED_BYTE,
                alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
                scaleMode: SCALE_MODES.NEAREST
            }
        );

        this.on("pointermove", this.onPointerMove.bind(this));
        this.on("pointerout", this.onPointerOut.bind(this));
    }


    public async onClick(point: Point, mouseButton: number) {
        const color = this.image.getPixel(point)

        if (mouseButton === 0) {
            if (ColorPickerManager.isEnabled.value) {
                return this.emit("will-color-pick", color)
            }

            return this.emit("will-place", point)
        }


        if (mouseButton === 2) {
            return this.emit("will-color-pick", color)
        }
    }

    private onPointerMove(event: FederatedPointerEvent) {
        const position = event.getLocalPosition(this)
        const { x: width, y: height } = this.image.size

        if (position.x < 0
            || position.x > width
            || position.y < 0
            || position.y > height) return

        const point = new Point(Math.floor(position.x), Math.floor(position.y))

        this.emit("hover", point);
    }

    private onPointerOut(event: PointerEvent) {
        this.emit("out");
    }

    public setSquare(pos: Point, color: AppColor) {
        this.image.setPixel(pos, color)
        this.texture.update()

        this.emit("place", { point: pos, color });
    }
}