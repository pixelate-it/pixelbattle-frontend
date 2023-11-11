import { useContext } from "preact/hooks";
import styles from "./Coordinates.module.css";
import { CoordinatesContext } from "../../managers/coordinates";

export function Coordinates() {
    const coordinates = useContext(CoordinatesContext);

    if (!coordinates.areCoordinatesSet.value) return null

    return (
        <p className={styles.coordinates}>
            {coordinates.coordinates.value.x + ", " + coordinates.coordinates.value.y}
        </p>
    )
}