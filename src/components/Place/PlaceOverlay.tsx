import { AppColor } from "../../classes/AppColor";
import { PlaceManager } from "../../managers/place";
import { ColorPickerManager } from "../../managers/picker";

import { DragEvent } from "pixi-viewport/dist/types";
import { ALPHA_MODES, BLEND_MODES, FORMATS, SCALE_MODES, Texture } from "@pixi/core";
import { Point } from "@pixi/math";
import { Sprite } from "@pixi/sprite";
import { FederatedPointerEvent } from "@pixi/events";
import { OverlayManager } from "../../managers/overlay";
import { WHITE_TEXTURE } from "../../lib/WhiteTexture";


export class PlaceOverlay extends Sprite {
    get image() {
        if (OverlayManager.image.value === null) {
            throw new Error("Can't find image")
        }
        return OverlayManager.image.value
    }

    get size() {
        if (OverlayManager.image.value === null) {
            throw new Error("Can't find image")
        }
        return OverlayManager.image.value.size
    }


    constructor() {
        super()

        this.setup()
    }

    private setup() {
        this.alpha = 0.6

        OverlayManager.position.subscribe((value) => value && (this.position = value));
        OverlayManager.image.subscribe((value) => value ? this.show() : this.hide())
    }

    private hide() {
        this.visible = false

        this.texture = WHITE_TEXTURE
    }

    private show() {
        this.visible = true

        this.texture = Texture.fromBuffer(
            this.image.buffer,
            this.size.x,
            this.size.y,
        );
    }
}