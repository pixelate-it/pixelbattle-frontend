import { Color, Point } from "pixi.js";
import { AppColor } from "./types/AppColor";

export const config = {
    colors: {
        background: new AppColor("#282828"),
        palette: {
            colors: [
                new AppColor("#ff0000"),
                new AppColor("#00ff00"),
                new AppColor("#0000ff"),
                new AppColor("#000000"),
                new AppColor("#ffffff"),
            ],
            selected: new AppColor("#ffffff"), // Default selected color
        }

    },
    time: {
        update: {
            tags: 30000,
            info: 30000,
        },
        ws: 5000, // Websocket reconnect time
        shake: 200,
        notification: 3000,
        modCooldown: 50
    },
    shakeAmount: 0.1,
    zoomLevel: 0.25,
    discord: {
        clientId: "970714810905936022",
        redirectUri: "https://api.pixelbattle.fun/login",
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