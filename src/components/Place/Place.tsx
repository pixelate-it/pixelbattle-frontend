import { useContext, useEffect, useRef } from "preact/hooks";
import { Application, Point } from "pixi.js"
import { Viewport } from "pixi-viewport";
import { PlaceContext } from "../../managers/place";
import { config } from "../../config";
import { InfoContext } from "../../managers/info";
import { PlaceContainer } from "./PlaceContainer";
import { AppWebSocket } from "../../types/AppWebSocket";


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

        info
            .fetch()
            .then(() => image.create(new Point(info.info.peek().size.width, info.info.peek().size.height)))
            .then(() => image.fetch())
            .then(() => {
                const placeView = new PlaceContainer(viewport)

                viewport.addChild(placeView);
    
                const placeCenter = new Point(
                    info.info.value.size.width / 2,
                    info.info.value.size.height / 2
                )
    
                viewport.moveCenter(placeCenter)
                viewport.fit(true, image.image.value.size.x, image.image.value.size.y)
                viewport.zoomPercent(-0.25, true)
    
                app.render()
            })
            .then(() => {
                const ws = new AppWebSocket()

            })
    }

    useEffect(setup, [])

    return (
        <canvas ref={canvasRef}></canvas>
    )
}

