import { app } from "../app";
import { config } from "../config";

interface Info {
    season: {
        name: string
    },
    players: {
        total: number;
        online: number;
    }
}

export class InfoController {
    public info: Info;
    
    constructor() {
        this.update()
        this.startUpdating()
    }

    get hasEnded() {
        return this.info.season.name === "season:blank" 
    }

    public update() {
        this.fetchInfo().then(() => this.render())
    }

    public startUpdating() {
        setInterval(this.update.bind(this), config.updateTime.info)
    }

    private async fetchInfo() {
        this.info = await app.request.get<Info>("/info")
    }

    private render() {
        const infoContainer = document.getElementById("info");

        infoContainer.innerHTML = `
            <div class="season">${this.info.season.name}</div>
            <div class="players">
                ${this.info.players.online} / ${this.info.players.total} <span>онлайн</span>
            </div>
            ${
                this.hasEnded
                ? `<div class="ended">
                    Игра закончена
                </div>`
                : ""
            }
            
        `
    }

}