import { Color, Container, Point, Sprite } from "pixi.js";
import { WHITE_TEXTURE } from "../../lib/WhiteTexture";
// import { config } from "../config";
import { MyColor } from "../../types/color";
import { PlaceSignal } from "../../context/place";
import { config } from "../../config";
// import { app } from "../app";

export class PlacePointer extends Container {
    public border: Sprite;
    public background: Sprite;

    constructor() {
        super()
        this.setup()
    }

    public shake() {
        // console.log("SHake!!!")
        
    }

    public setup() {
        this.border = new Sprite(WHITE_TEXTURE);
        this.background = new Sprite(WHITE_TEXTURE);

        this.border.anchor.set(0.5, 0.5)
        this.background.anchor.set(0.5, 0.5)
        this.border.scale.set(1 + config.hover.outlineSize)
        this.eventMode = "none"

        this.addChild(this.border, this.background)
    }

    public hover(point: Point) {
        this.visible = true
        this.position.set(point.x + 0.5, point.y + 0.5)
        this.scale.set(config.hover.scale)
        
        const color = PlaceSignal.image.value.getPixel(point)
        this.background.tint = color
        this.border.tint = color.getReadableColor()
    }

    public out() {
        this.visible = false
        this.scale.set(1)
    }
}