import { app } from "../app";
import { config } from "../config";
import { Cooldown } from "./cooldown";

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
    private lastPlaceDate: Date = new Date();
    private container = document.getElementById("info");
    public cooldown: Cooldown = new Cooldown();
    private _hasEnded: boolean;

    constructor() {
        this.update()
        this.startUpdating()
    }

    get hasEnded() {
        return this.info.season.name === "season:blank" ?? this._hasEnded
    }

    set hasEnded(value: boolean) {
        this._hasEnded = value
    }

    public update() {
        this.fetchInfo().then(() => this.render())
    }

    public startUpdating() {
        setInterval(this.update.bind(this), config.time.update.info)
    }

    private async fetchInfo() {
        this.info = await app.request.get<Info>("/info")
    }

    private render() {
        this.container.innerHTML = ``;

        this.renderSeason();
        this.renderEndGame();
        this.renderPlayersOnline();
        this.renderCooldown();
    }

    private renderSeason() {
        if (!this.hasEnded) return

        const info = document.createElement("div");
        info.classList.add("season");
        info.innerHTML = `${this.info.season.name}`;

        this.container.appendChild(info);
    }

    private renderEndGame() {
        const info = document.createElement("div");
        info.classList.add("ended");

        info.innerHTML = `Игра закончена`;

        this.container.appendChild(info);
    }

    private renderPlayersOnline() {
        const info = document.createElement("div");
        info.classList.add("players");
        info.innerHTML = `${this.info.players.online} / ${this.info.players.total} <span>онлайн</span>`;

        this.container.appendChild(info);
    }

    private renderCooldown() {
        this.container.appendChild(this.cooldown.render());
    }

    

}