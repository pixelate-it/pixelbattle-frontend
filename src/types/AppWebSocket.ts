import { config } from "../config";
import { InfoManager } from "../managers/info";
import { PlaceManager } from "../managers/place";
import { MessageData } from "../interfaces/Actions";
import { AppColor } from "./AppColor";
import { Point } from "pixi.js";


export class AppWebSocket extends WebSocket {
    constructor() {
        super(config.url.api.replace("http", "ws") + "/pixels/socket")

        this.setup()
    }

    private setup() {
        this.addEventListener("open", this.onOpen.bind(this))
        this.addEventListener("message", this.onMessage.bind(this))
        this.addEventListener("close", this.onClose.bind(this))
        this.addEventListener("error", this.onError.bind(this))
    }

    private async onMessage(event: MessageEvent<string | Blob>) {
        const data: MessageData = event.data instanceof Blob
            ? await new Response(event.data).json()
            : JSON.parse(event.data);

        if (PlaceManager.image.value === null) {
            return;
        }

        switch (data.op) {
            case 'PLACE':
                PlaceManager.image.value.setPixel(new Point(data.x, data.y), new AppColor(data.color))
                PlaceManager.container.value.update()
                break;

            case 'ENDED':
                if (data.value)
                    InfoManager.start()
                else 
                    InfoManager.end()
                break;
        }
    }

    private onOpen(event: Event) {
    }

    private onClose(event: CloseEvent) {
        setTimeout(this.setup.bind(this), config.time.ws)
    }

    private onError(event: Event) {
        this.onClose(new CloseEvent("close", event))
    }
}