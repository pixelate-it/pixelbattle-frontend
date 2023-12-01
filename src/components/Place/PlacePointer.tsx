import { Container, Point, Sprite } from "pixi.js";
import { WHITE_TEXTURE } from "../../lib/WhiteTexture";
import { PlaceManager } from "../../managers/place";
import { config } from "../../config";
import { AppColor } from "../../types/AppColor";

function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export class PlacePointer extends Container {
    public border: Sprite;
    public background: Sprite;
    private isShaking: boolean = false;

    constructor() {
        super()
        this.border = new Sprite(WHITE_TEXTURE);
        this.background = new Sprite(WHITE_TEXTURE);

        this.setup()
    }


    public startShake() {
        const originalPosition = this.position.clone();
        const startTime = Date.now();

        const shake = (time: number) => {
            this.position.x = originalPosition.x + getRandomArbitrary(-config.shakeAmount, config.shakeAmount);
            this.position.y = originalPosition.y + getRandomArbitrary(-config.shakeAmount, config.shakeAmount);

            this.isShaking = true

            if (Date.now() - startTime > config.time.shake) {
                this.position.x = originalPosition.x;
                this.position.y = originalPosition.y;

                this.isShaking = false
                return;
            }

            requestAnimationFrame(shake);
        }

        shake(0)
    }

    public setup() {
        this.border.anchor.set(0.5, 0.5)
        this.background.anchor.set(0.5, 0.5)
        this.border.scale.set(1 + config.hover.outlineSize)
        this.eventMode = "none"
        this.visible = false

        this.addChild(this.border, this.background)
    }

    public hover(point: Point) {
        this.visible = true

        if (this.isShaking) return

        this.position.set(point.x + 0.5, point.y + 0.5)
        this.scale.set(config.hover.scale)

        if (PlaceManager.image.value === null) {
            return
        }

        const color = PlaceManager.image.value.getPixel(point) ?? new AppColor("#ffffff")
        this.background.tint = color 
        this.border.tint = color.getReadableColor()
    }

    public out() {
        this.visible = false
        this.scale.set(1)
    }
}