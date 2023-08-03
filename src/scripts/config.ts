import { Color } from "pixi.js";

export const config = {
    colors: {
        background: 0x555555,
        outline: 0x333333,
        palette: [
            new Color("#ff0000"),
            new Color("#00ff00"),
            new Color("#0000ff"),
            new Color("#000000"),
            new Color("#ffffff"),
        ],
        selected: new Color("#ffffff"),
        create: new Color("#000000"),
    },
    updateTime: {
        tags: 30000,
        info: 30000
    },
    size: {
        width: 160,
        height: 80,
    },
    discord: {
        clientId: "1135869746194157598",
        redirectUri: "http://localhost:9000",
        scope: ["identify", "guilds.join"]
    },
    outlineSize: 1.2,
    url: {
        api: "https://api.pixelbattle.fun",
        client: "https://pixelbattle.fun",
        ws: "wss://api.pixelbattle.fun/pixels/socket"
    }
}