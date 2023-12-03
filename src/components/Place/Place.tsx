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
import { PlaceApp } from "./PlaceApp";
import styles from "./Place.module.css"


export function Place() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const place = useContext(PlaceContext);
    // const pixelInfp = useContext(CoordinatesContext);
    // const info = useContext(InfoContext)

    function setup() {
        const app = new PlaceApp(canvasRef);

        place.fetch().then(() => app.create(place))
    }

    useEffect(setup, [])



    return (
        <canvas ref={canvasRef} className={styles.canvas}></canvas>
    )
}

