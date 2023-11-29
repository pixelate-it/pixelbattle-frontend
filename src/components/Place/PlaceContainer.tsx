import { Container, FederatedPointerEvent, Point } from "pixi.js";
import { AppColor } from "../../types/AppColor";
import { PaletteManager } from "../../managers/palette";
import { PlacePointer } from "./PlacePointer";
import { PlaceView } from "./PlaceView";
import { CooldownManager } from "../../managers/cooldown";
import { CoordinatesManager } from "../../managers/coordinates";
import { ProfileManager } from "../../managers/profile";
import { Viewport } from "pixi-viewport";
import { PlaceManager } from "../../managers/place";
import { InfoManager } from "../../managers/info";
import { ColorPickerManager } from "../../managers/picker";
import { MyFetch } from "../../types/AppFetch";
import { DragEvent } from "pixi-viewport/dist/types";
import { NotificationList } from "../Notifications/NotificationList/NotificationList";
import { NotificationInfo, NotificationsManager } from "../../managers/notifications";
import { ClientNotificationMap } from "../../lib/notificationMap";
import { Ref, RefObject } from "preact";
import { PixelInfo } from "../../interfaces/Pixels";
import { config } from "../../config";

type Reason = "Cooldown" | "Not logged" | "Game ended" | "Banned"



export class PlaceContainer extends Container {
    private pointer = new PlacePointer();
    public place = new PlaceView();
    // private isDragged = false;

    get isDragged() {
        return this.place.isDragged
    }

    set isDragged(v: boolean) {
        this.place.isDragged = v
    }



    private pixelInfo = {
        lastPoint: new Point(-1, -1),
        lastPointTime: 0,
        timeoutId: 0,
    }

    constructor(private viewport: Viewport, private canvasRef: RefObject<HTMLCanvasElement>) {
        super();

        this.setup();
    }


    public setup() {
        this.on("cant-place", this.onCantPlace.bind(this));

        this.viewport.on("drag-start", this.onDragStart.bind(this));
        this.viewport.on("drag-end", this.onDragEnd.bind(this));

        this.viewport.on("zoomed", (e) => this.place.isZommed = true)
        this.viewport.on("zoomed-end", (e) => this.place.isZommed = false)

        this.place.on("will-place", this.onWillPlace.bind(this));
        this.place.on("place", this.onPlace.bind(this));
        this.place.on("will-color-pick", this.onWillColorPick.bind(this));
        this.place.on("hover", this.onHover.bind(this));
        this.place.on("out", this.onOut.bind(this));

        this.addChild(this.place);
        this.addChild(this.pointer);
    }

    public onDragStart(event: DragEvent) {
        if (this.canvasRef.current)
            this.canvasRef.current.style.cursor = "grabbing";

        this.isDragged = true;
    }

    public onDragEnd(event: DragEvent) {

        if (this.canvasRef.current)
            this.canvasRef.current.style.cursor = "crosshair";



        this.cursor = "default"
        this.isDragged = false;
    }

    public onCantPlace({ reason }: { reason: Reason }) {
        NotificationsManager.addNotification({
            ...ClientNotificationMap[reason],
            type: "error"
        })

        this.pointer.startShake();
    }

    public onWillPlace(point: Point) {
        if (this.isDragged) {
            return
        };

        if (CooldownManager.hasCooldown.peek()) {
            return this.emit("cant-place", { reason: "Cooldown" });
        };

        if (!ProfileManager.token.peek()) {
            return this.emit("cant-place", { reason: "Not logged" });
        };
        if (InfoManager.info.value.ended) {
            return this.emit("cant-place", { reason: "Game ended" });
        };

        if (ProfileManager.isBanned.value) {
            return this.emit("cant-place", { reason: "Banned" });
        };

        const color = PlaceManager.image.value.getPixel(point);

        this.place.setSquare(point, PaletteManager.palette.value.selected);

        MyFetch.putPixel({
            color: PaletteManager.palette.value.selected.toHex(),
            x: point.x,
            y: point.y
        }).catch((r) => {
            this.place.setSquare(point, color);
        })
    }

    public onPlace(point: Point) {
        this.pointer.hover(point);
        // if (ProfileManager.isMod.value) {
        //     return
        // };
        CooldownManager.start()
    }


    public onHover(point: Point) {
        CoordinatesManager.setCoordinates(point)
        this.pointer.hover(point)

        if (this.pixelInfo.lastPoint.equals(point)) {
            if (this.pixelInfo.timeoutId === -1) {
                CoordinatesManager.info.value = "loading"
                this.pixelInfo.timeoutId = window.setTimeout(() => {
                    if (CoordinatesManager.coordinates.value.x === -1 || CoordinatesManager.coordinates.value.y === -1) {
                        return
                    }
                    CoordinatesManager.fetchInfo()
                }, config.time.pixelInfo)
            }


            return
        }

        window.clearTimeout(this.pixelInfo.timeoutId);
        this.pixelInfo.timeoutId = -1;
        this.pixelInfo.lastPoint = point.clone();
        CoordinatesManager.info.value = null;
    }

    public update() {
        this.place.texture.update()
    }

    public onOut() {
        CoordinatesManager.removeCoordinates()
        this.pointer.out()
    }

    public onWillColorPick(color: AppColor) {
        if (this.isDragged) {
            return
        };

        ColorPickerManager.isEnabled.value = false

        PaletteManager.addAndSelect(color)
    }
}