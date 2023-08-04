import { Application, Point } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { config } from "../config";
import { Canvas } from "./canvas";
import { MyBuffer } from "../types/buffer";


export class Game {
    private app: Application<HTMLCanvasElement>;
    private viewport: Viewport;
    public canvas: Canvas

    constructor() {
        this.app = new Application({
            resizeTo: window,
            backgroundColor: config.colors.background,
        });

        this.viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: config.size.x,
            events: this.app.renderer.events,
            worldHeight: config.size.y,
            disableOnContextMenu: true
        });

        this.canvas = new Canvas()
        
        this.canvas.loadImage(MyBuffer.getRandom(config.size))
        this.viewport.fit()
        

        this.setup()
    }

    public setup() {
        document.body.appendChild(this.app.view);
        this.app.stage.addChild(this.viewport);
        this.viewport.drag().pinch().wheel();
        this.viewport.on("drag-start", (event) => {
            this.canvas.isDragged = true;
        });
        
        this.viewport.on("drag-end", (event) => {
            this.canvas.isDragged = false;
        });
        this.viewport.addChild(this.canvas);
    }
}