import { config } from "../config";
import { InfoManager } from "../managers/info";
import { PlaceManager } from "../managers/place";
import { MessageData } from "../interfaces/Actions";
import { MyColor } from "./MyColor";


export class MyWebSocket extends WebSocket {
    constructor() {
        super(config.url.ws)

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

        console.log(data)

        switch (data.op) {
            case 'PLACE':
                PlaceManager.image.value.setPixel(data.id, new MyColor(data.color))
                break;

            case 'ENDED':
                InfoManager.end()
                break;
        }
    }

    private onOpen(event: Event) {
        console.log("Connected")
    }

    private onClose(event: CloseEvent) {
        setTimeout(this.setup.bind(this), config.time.ws)
    }

    private onError(event: Event) {
        this.onClose(new CloseEvent("close", event))
    }
}