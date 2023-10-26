import { useContext, useEffect, useRef } from "preact/hooks";
import { Application } from "pixi.js"
import { Viewport } from "pixi-viewport";
import { PlaceContext } from "../../context/place";
import { config } from "../../config";
import { InfoContext } from "../../context/info";
import { PlaceContainer } from "./PlaceContainer";


export function Place() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const image = useContext(PlaceContext);
    const info = useContext(InfoContext)

    function setup() {
        const app = new Application({
            view: canvasRef.current!,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: config.colors.background,
        });


        const viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 1000,
            events: app.renderer.events,
            worldHeight: 1000,
            disableOnContextMenu: true
        });

        app.stage.addChild(viewport);

        viewport.drag().pinch().wheel()

        viewport.fit(true)


        Promise.all([info.fetch(), image.fetch()]).then(() => {
            const placeView = new PlaceContainer()

            viewport.addChild(placeView);
            app.render()
        })
    }

    useEffect(setup, [])

    return (
        <canvas ref={canvasRef}></canvas>
    )
}

