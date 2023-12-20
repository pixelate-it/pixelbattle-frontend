import { Sprite, Texture, FederatedPointerEvent, Point } from "pixi.js";
import { AppColor } from "../../classes/AppColor";
import { PlaceManager } from "../../managers/place";
import { InfoManager } from "../../managers/info";
import { ColorPickerManager } from "../../managers/picker";
import { DragEvent } from "pixi-viewport/dist/types";


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

    private numOfTouches = 0
    public isZommed = false;
    public isDragged = false;

    constructor() {
        super()


        this.setup()
    }

    private setup() {
        this.eventMode = "static"


        this.texture = Texture.fromBuffer(
            this.image.buffer, 
            this.size.x, 
            this.size.y)

        this.on("pointermove", this.onPointerMove.bind(this));
        this.on("pointerout", this.onPointerOut.bind(this));
    }


    public async onClick(event: DragEvent) {
        const ev = (event.event as FederatedPointerEvent)
        const position = ev.getLocalPosition(this)
        const point = new Point(Math.floor(position.x), Math.floor(position.y))
        const color = this.image.getPixel(point)


        if (ev.button === 0) {
            if (ColorPickerManager.isEnabled.value) {
                return this.emit("will-color-pick", color)
            }

            return this.emit("will-place", point)
        }


        if (ev.button === 2) {
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