import { Sprite, Texture, FederatedPointerEvent, Point } from "pixi.js";
import { AppColor } from "../../types/AppColor";
import { PlaceManager } from "../../managers/place";
import { InfoManager } from "../../managers/info";
import { ColorPickerManager } from "../../managers/picker";


export class PlaceView extends Sprite {
    get image() {
        return PlaceManager.image.value
    }

    get size() {
        return PlaceManager.image.value.size
    }

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
        this.on("pointerup", this.onClick.bind(this));
    }


    private async onClick(event: FederatedPointerEvent) {
        const position = event.getLocalPosition(this)
        const x = Math.floor(position.x)
        const y = Math.floor(position.y)
        const point = new Point(x, y)
        const color = this.image.getPixel(point)


        if (event.button === 0) {
            if (ColorPickerManager.isEnabled.value) {
                return this.emit("will-color-pick", color)
            }

            return this.emit("will-place", point)
        }


        if (event.button === 2) {

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