import { Color, ColorSource, Container, FederatedPointerEvent, Graphics, Point, Sprite, Texture } from "pixi.js";
// import { config } from "../config";
import { WHITE_TEXTURE } from "../../lib/WhiteTexture";
// import { app } from "../app";
// import { modals } from "../lib/modals";
// import { Pointer } from "./pointer";
import { MyColor } from "../../types/color";
import { MyBuffer } from "../../types/buffer";
import { useContext } from "preact/hooks";
import { PaletteContext, PaletteProps, PaletteSignal } from "../../context/palette";
import { PlacePointer } from "./PlacePointer";
import { PlaceView } from "./PlaceView";


export class PlaceContainer extends Container {
    private pointer: PlacePointer;
    private place: PlaceView;


    // public buffer: MyBuffer;
    // public isDragged = false;

    constructor() {
        super();

        this.setup();
    }


    public setup() {
        // console.log()
        this.place = new PlaceView();
        this.place.addEventListener("will-place", this.onWillPlace.bind(this));
        this.place.addEventListener("color-picked", this.onColorPicked.bind(this));
        this.place.addEventListener("hover", this.onHover.bind(this));
        this.place.addEventListener("out", this.onOut.bind(this));
        this.addChild(this.place);

        this.pointer = new PlacePointer();
        this.addChild(this.pointer);
    }

    public onWillPlace(point: Point) {
        this.place.setSquare(point, PaletteSignal.palette.value.selected);
        this.pointer.hover(point)
    }

    public onHover(point: Point) {
        this.pointer.hover(point)
    }

    public onOut() {
        this.pointer.out()
    }

    public onColorPicked(color: MyColor) {
        PaletteSignal.addAndSelect(color)
    }
}