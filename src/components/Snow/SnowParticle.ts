import { Texture } from "@pixi/core";
import { Application } from "@pixi/app";
import { Sprite } from "@pixi/sprite";
import { Graphics } from "@pixi/graphics";
;
import { random } from "../../lib/random";
import { config } from "../../config";
import { AppColor } from "../../classes/AppColor";


export interface SnowParticleData {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
}

export class SnowParticle extends Sprite {
    public static graphics = new Graphics()
        .beginFill(new AppColor(0xffffff))
        .drawCircle(config.snow.size / 2, config.snow.size / 2, config.snow.size)
        .endFill();
    public static texture: Texture;
    public static app: Application;

    public vx: number;
    public vy: number;

    public constructor(data: SnowParticleData) {
        super(SnowParticle.texture);
        this.x = data.x;
        this.y = data.y;
        this.vx = data.vx;
        this.vy = data.vy;
        this.alpha = data.alpha;
    }

    public static getRandomParticle() {
        const particle = new SnowParticle({
            x: random(0, SnowParticle.app.renderer.width),
            y: -5,
            vx: random(-2, 2),
            vy: random(8, 10),
            alpha: random(0, 1),
        })

        
        return particle
    }

    public static getRandomParticles(amount: number): SnowParticle[] {
        return Array.from({ length: amount }, (_, i) => SnowParticle.getRandomParticle())
    }

    public reset() {
        this.x = random(0, SnowParticle.app.renderer.width);
        this.y = 0;
        this.vx = random(-3, 3);
    }

    public randomize() {
        this.vx += random(-1, 1)
        this.vy = random(2, 6)
    }

    public update(time: number) {
        if (this.y > 0) this.x += this.vx
        this.y += this.vy


        if (Math.random() > 0.9) this.randomize()

        const isOutOfScreen = this.x > SnowParticle.app.renderer.width
            || this.x < 0
            || this.y > SnowParticle.app.renderer.height

        if (isOutOfScreen)
            this.reset()
    }
}
