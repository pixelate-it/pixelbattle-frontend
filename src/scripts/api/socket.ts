import { Color, ColorSource, Point } from "pixi.js";
import { app } from "../app";
import { config } from "../config";
import { indexToPoint } from "../lib/coords";

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
    public hasEnded = false;

    constructor() {
        this.ws = new WebSocket(config.url.ws)

        this.ws.onmessage = this.onMessage
        this.ws.onopen = this.onOpen
        this.ws.onclose = this.onClose
        this.ws.onerror = this.onError
    }

    private async onMessage(event: MessageEvent<string | Blob>) {
        const data: MessageData = event.data instanceof Blob
            ? await new Response(event.data).json()
            : JSON.parse(event.data);

        switch (data.op) {
            case 'PLACE':
                app.game.canvas.setSquare(indexToPoint(data.id), new Color(data.color));
                break;

            case 'ENDED':
                this.hasEnded = true
                break;
        }
    }

    private onOpen(event: MessageEvent) {
        app.request.get<{ pixels: Pixel[] }>("/pixels/get").then(({ pixels }) => {
            const buffer = new Uint8Array(config.size.width * config.size.height * 4)

            pixels.forEach((pixel, index) => {
                const color = new Color(pixel.color.toLowerCase()).toUint8RgbArray();

                buffer[index * 4] = color[0];
                buffer[index * 4 + 1] = color[1];
                buffer[index * 4 + 2] = color[2];
                buffer[index * 4 + 3] = 255;
            })

            app.game.canvas.loadImage(buffer);
        })
    }

    private onClose(event: CloseEvent) {

    }

    private onError(event: MessageEvent) {

    }
}