import { AppColor } from "./classes/AppColor";

export const config = {
    defaults: {
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
        settings: {
            enableSnow: true
        }
    },
    time: {
        update: {
            tags: 30000,
            info: 30000,
        },
        ws: 2000, // Websocket reconnect time
        shake: 200,
        notificationRemoved: 3000,
        modCooldown: 50,
        pixelInfo: 500,
    },
    shakeAmount: 0.1,
    zoom: {
        defaultLevel: 0.25,
        maxLevel: 3,
        minLevelPx: 5
    },
    discord: {
        clientId: (import.meta.env.VITE_DISCORD_BOT_ID as string)!,
        redirectUri: (import.meta.env.VITE_DISCORD_BOT_REDIRECT as string)!,
        scope: ["identify", "guilds.join"]
    },
    hover: {
        outlineSize: 0.1,
        scale: 1.2
    },
    url: {
        api: (import.meta.env.VITE_BACKEND as string)!,
    },
    snow: {
        size: 2,
        amount: 100,
    },
    media: {
        youtube: "https://www.youtube.com/@pixelate-it",
        discord: "https://discord.gg/XBPyGUv3DT",
        github: "https://github.com/pixelate-it",
        help: "https://help.pixelbattle.fun"
    }
}