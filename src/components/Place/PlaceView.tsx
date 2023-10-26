import { Sprite, Texture, FederatedPointerEvent, Point } from "pixi.js";
import { MyBuffer } from "../../types/buffer";
import { MyColor } from "../../types/color";
import { PlaceSignal } from "../../context/place";
import { InfoSignal } from "../../context/info";


export class PlaceView extends Sprite {
    get image() {
        return PlaceSignal.image.value
    }

    get size() {
        return InfoSignal.info.value.size
    }

    constructor() {
        super()


        this.setup()
    }

    private setup() {
        this.eventMode = "static"
        this.texture = Texture.fromBuffer(
            this.image.buffer, 
            this.size.width, 
            this.size.height)

        this.on("pointermove", this.onPointerMove.bind(this));
        this.on("pointerout", this.onPointerOut.bind(this));
        this.on("pointerup", this.onClick.bind(this));
    }


    private async onClick(event: FederatedPointerEvent) {
        // if (this.isDragged) return;

        // console.log("A")

        const position = event.getLocalPosition(this)
        const x = Math.floor(position.x)
        const y = Math.floor(position.y)
        const point = new Point(x, y)

        // if (!app.auth.token) {
        //     return modals.NOT_AUTH.render()
        // }

        if (false) return this.emit("cant-place", { reason: "Not logged" })


        // if (app.info.hasEnded) 
        //     return modals.ENDED.render()

        if (false) return this.emit("cant-place", { reason: "Game ended" })



        if (event.button === 0) {
            // if (app.info.cooldown.isInProcess) return this.pointer.shake()
            if (false) return this.emit("cant-place", { reason: "Cooldown" })

            return this.emit("will-place", point)
        }


        if (event.button === 2) {
            const color = this.image.getPixel(point)

            
            // const colorInPalette = app.palette.colors
            //     .find(c => c.color.equals(color))     

            // if (colorInPalette) {
            //     return app.palette.setSelectedColor(colorInPalette.id)
            // }

            // return app.palette.addColor(color)

            return this.emit("color-picked", color)
        }

    }



    // private async placeOwnPixel(point: Point) {
    //     try {
    //         const color = getPaletteContext()
                
 

    //         // await app.request.post("/pixels/put")({
    //         //     id: this.buffer.pointToIndex(point),
    //         //     color: color.toHex(),
    //         // })
    //         // this.setSquare(point, color)
    //         // app.info.cooldown.start()


    //         this.setSquare(point, color.selectedColor)
    //     } catch {}
    // }

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

    public setSquare(pos: Point, color: MyColor) {
        this.image.setPixel(pos, color)
        this.texture.update()

        this.emit("place", { point: pos, color });
    }
}