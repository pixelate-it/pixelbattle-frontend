import { Color, Point } from "pixi.js";
import { MyColor } from "./types/color";

export const config = {
    colors: {
        background: new MyColor(0x555555),
        palette: [
            new MyColor("#ff0000"),
            new MyColor("#00ff00"),
            new MyColor("#0000ff"),
            new MyColor("#000000"),
            new MyColor("#ffffff"),
        ],
        selected: new MyColor("#ffffff"), // Default selected color
        create: new MyColor("#000000"), // Default color when creating new one
    },
    time: {
        update: {
            tags: 30000,
            info: 30000,
        },
        ws: 5000, // Websocket reconnect time
        cooldown: 5000,
        animation: 10
    },
    size: new Point(160, 80),
    discord: {
        clientId: "1135869746194157598",
        redirectUri: "http://localhost:9000",
        scope: ["identify", "guilds.join"] 
    },
    hover: {
        outlineSize: 0.1,
        scale: 1.2
    },
    url: {
        api: "https://api.pixelbattle.fun", 
        client: "https://pixelbattle.fun",
        ws: "wss://api.pixelbattle.fun/pixels/socket"
    }
}