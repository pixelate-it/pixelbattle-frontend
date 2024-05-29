import { ALPHA_MODES, FORMATS, SCALE_MODES, Texture } from "@pixi/core";
import { Sprite } from "@pixi/sprite";
import { OverlayManager } from "../../managers/overlay";
import { WHITE_TEXTURE } from "../../lib/WhiteTexture";


export class PlaceOverlay extends Sprite {
    constructor() {
        super()

        this.setup()
    }

    private setup() {
        this.eventMode = "static"
        this.hitArea = {
            contains: () => false
        }

        OverlayManager.opacity.subscribe(opacity => opacity && (this.alpha = opacity / 100));
        OverlayManager.position.subscribe((position) => {
            if (position) {
                this.position = position;
            }
        });
        OverlayManager.image.subscribe((image) => image ? this.show() : this.hide())
    }

    private hide() {
        this.visible = false

        this.texture = WHITE_TEXTURE
    }

    private show() {
        this.visible = true

        this.texture = Texture.fromBuffer(
            OverlayManager.image.value!.buffer,
            OverlayManager.image.value!.size.x,
            OverlayManager.image.value!.size.y,
            {
                format: FORMATS.RGBA,
                alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
                scaleMode: SCALE_MODES.NEAREST
            }
        );
    }
}