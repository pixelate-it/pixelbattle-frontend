import { useContext, useEffect, useRef } from "preact/hooks";
import { Application, Point } from "pixi.js"
import { Viewport } from "pixi-viewport";
import { PlaceContext } from "../../managers/place";
import { config } from "../../config";
import { InfoContext } from "../../managers/info";
import { PlaceContainer } from "./PlaceContainer";
import { AppWebSocket } from "../../types/AppWebSocket";
import { effect } from "@preact/signals";
import { CoordinatesContext } from "../../managers/coordinates";


export function Place() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const place = useContext(PlaceContext);
    // const pixelInfp = useContext(CoordinatesContext);
    // const info = useContext(InfoContext)

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

        place.fetch()
            .then(() => {
                const placeView = new PlaceContainer(viewport)

                viewport.addChild(placeView);
    
                const placeCenter = new Point(
                    place.image.value.size.x / 2,
                    place.image.value.size.y / 2
                )
    
                viewport.moveCenter(placeCenter)
                viewport.fit(true, place.image.value.size.x, place.image.value.size.y)
                viewport.zoomPercent(-config.zoomLevel, true)

    
                window.addEventListener('resize', () => {
                    app.renderer.resize(window.innerWidth, window.innerHeight);
                    viewport.resize(window.innerWidth, window.innerHeight);
                })

                const ws = new AppWebSocket();

                place.place.value = placeView

                app.render()

            })
            
    }

    // effect(() => {
    //     if (pixelInfp.info.value.author)
    //         canvasRef.current?.setAttribute("title", pixelInfp.info.value.author)
    // })

    useEffect(setup, [])



    return (
        <canvas ref={canvasRef}></canvas>
    )
}

