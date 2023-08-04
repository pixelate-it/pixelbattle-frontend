import { config } from "../config";

export class Cooldown {
    private container: HTMLDivElement;
    private progressBarEl: HTMLProgressElement;
    private countdownEl: HTMLParagraphElement;
    private interval: NodeJS.Timer;
    private startedAt: Date = new Date(0);

    constructor() {
        this.setup()
    }

    private setup() {
        this.container = document.createElement("div");
        this.container.classList.add("cooldown");
        this.container.style.display = "none";

        this.progressBarEl = document.createElement('progress');
        this.progressBarEl.classList.add('progress-bar');
        this.progressBarEl.max = 100;
        this.progressBarEl.value = 0;

        this.countdownEl = document.createElement('p');
        this.countdownEl.classList.add('time');

        this.container.appendChild(this.progressBarEl);
        this.container.appendChild(this.countdownEl);
    }

    public start() {
        this.startedAt = new Date();
        this.container.style.display = "block";
        this.interval = setInterval(this.update.bind(this), config.time.cooldown / 100)
    }

    private update() {
        if (this.progressBarEl.value >= 100) {
            this.progressBarEl.value = 0
            this.container.style.display = "none";

            return clearInterval(this.interval)
        }
        const remainingSeconds = (new Date().getTime() - this.startedAt.getTime()) / 1000;
        this.countdownEl.innerHTML = `${remainingSeconds.toFixed(1)}с`
        this.progressBarEl.value++
    }

    public render() {
        return this.container
    }

    get isInProcess() {
        return this.startedAt.getTime() + config.time.cooldown > new Date().getTime()
    }


} 