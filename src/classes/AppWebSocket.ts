import { config } from "../config";
import { InfoManager } from "../managers/info";
import { PlaceManager } from "../managers/place";
import { MessageData } from "../interfaces/Actions";
import { AppColor } from "./AppColor";
import { Point } from "pixi.js";


export class AppWebSocket {
    private ws!: WebSocket;


    constructor() {
        this.connect()
    }

    public connect() {
        this.createWebSocket()
        this.setupEventListeners()
    }

    private createWebSocket() {
        this.ws = new WebSocket(config.url.api.replace("http", "ws") + "/pixels/socket")
    }

    private setupEventListeners() {
        this.ws.addEventListener("open", this.onOpen.bind(this))
        this.ws.addEventListener("message", this.onMessage.bind(this))
        this.ws.addEventListener("close", this.onClose.bind(this))
        this.ws.addEventListener("error", this.onError.bind(this))
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
                    InfoManager.end()
                else 
                    InfoManager.start()
                break;
        }
    }

    private onOpen(event: Event) {
    }

    private reconnect() {
        PlaceManager.fetch()
            .then(() => PlaceManager.container.value.update())
            .then(() => this.connect())
    }

    private onClose(event: CloseEvent) {
        setTimeout(this.reconnect.bind(this), config.time.ws)
    }

    private onError(event: Event) {
        this.onClose(new CloseEvent("close", event))
    }
}