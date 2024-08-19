import { useContext, useEffect, useRef } from "preact/hooks";
import { PlaceContext } from "../../managers/place";
import { PlaceApp } from "./PlaceApp";
import styles from "./Place.module.css";
import { KeyboardManager } from "../../managers/keyboard";

export function Place() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const place = useContext(PlaceContext);
	// const pixelInfp = useContext(CoordinatesContext);
	// const info = useContext(InfoContext)

	function setup() {
		const app = new PlaceApp(canvasRef);

		place.fetch().then(() => app.create(place));
		KeyboardManager.addEventListeners();

		return () => {
			KeyboardManager.removeEventListeners();
		};
	}

	useEffect(setup, []);

	return <canvas ref={canvasRef} className={styles.canvas}></canvas>;
}
