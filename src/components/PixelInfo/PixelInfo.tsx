import { useContext } from "preact/hooks";
import { CoordinatesContext } from "../../managers/coordinates";
import styles from "./PixelInfo.module.css";

export function PixelInfo() {
    const coords = useContext(CoordinatesContext);

    if (!coords.info.value) return null;

    return (<div className={styles.wrapper}>
        <p className={styles.info}>
            <strong>{coords.info.value.author}</strong>
            {coords.info.value.tag && <span>#{coords.info.value.tag}</span>}
        </p>
    </div>)
}