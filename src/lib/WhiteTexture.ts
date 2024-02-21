import { ALPHA_MODES, FORMATS, SCALE_MODES, Texture } from "@pixi/core";


export const WHITE_TEXTURE = Texture.fromBuffer(new Uint8Array([255, 255, 255]), 1, 1, { alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA, format: FORMATS.RGB, scaleMode: SCALE_MODES.NEAREST });