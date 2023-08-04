import { Color, ColorSource, Point } from "pixi.js";
import { app } from "../app";
import { config } from "../config";
import { MyColor } from "../types/color";
import { MyBuffer } from "../types/buffer";

interface PlaceMessageData {
    op: "PLACE";
    id: number;
    color: string;
}

interface EndedMessageData {
    op: "ENDED"
}

type MessageData = PlaceMessageData | EndedMessageData


interface Pixel {
    id: number;
    color: string;
    tag: string;
}

export class WebSocketController {
    public ws: WebSocket;

    constructor() {
        this.connect()
    }

    private connect() {
        this.ws = new WebSocket(config.url.ws)

        this.ws.addEventListener("open", this.onOpen.bind(this))
        this.ws.addEventListener("message", this.onMessage.bind(this))
        this.ws.addEventListener("close", this.onClose.bind(this))
        this.ws.addEventListener("error", this.onError.bind(this))
    }

    private async onMessage(event: MessageEvent<string | Blob>) {
        const data: MessageData = event.data instanceof Blob
            ? await new Response(event.data).json()
            : JSON.parse(event.data);

        switch (data.op) {
            case 'PLACE':
                const point = app.game.canvas.buffer.indexToPoint(data.id);
                const color = new MyColor(data.color)

                app.game.canvas.setSquare(point, color);
                break;

            case 'ENDED':
                app.info.hasEnded = true
                break;
        }
    }

    private onOpen(event: MessageEvent) {
        app.request.get<{ pixels: Pixel[] }>("/pixels/get").then(({ pixels }) => {
            const buffer = new MyBuffer(config.size);

            pixels.forEach((pixel, index) => {
                const color = new MyColor(pixel.color.toLowerCase())

                buffer.setPixel(index, color);
            })

            app.game.canvas.loadImage(buffer);
        })
    }

    private onClose(event: CloseEvent) {
        setTimeout(this.connect.bind(this), config.time.ws)
    }

    private onError(event: Event) {
        this.onClose(new CloseEvent("close", event))
    }
}