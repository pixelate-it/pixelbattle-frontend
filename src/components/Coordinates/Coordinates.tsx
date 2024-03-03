import { useContext } from "preact/hooks";
import styles from "./Coordinates.module.css";
import { CoordinatesContext } from "../../managers/coordinates";

export function Coordinates() {
    const coordinates = useContext(CoordinatesContext);

    if (!coordinates.areCoordinatesSet.value) {
        // Fixes jumping when sidebar in scroll mode 
        return <p className={[styles.coordinates, styles.empty].join(" ")}>
            Пусто
        </p>
    }

    return (
        <p className={styles.coordinates}>
            {coordinates.coordinates.value.x + ", " + coordinates.coordinates.value.y}
        </p>
    )
}