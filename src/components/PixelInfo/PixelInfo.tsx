import { useContext } from "preact/hooks";
import { CoordinatesContext } from "../../managers/coordinates";
import styles from "./PixelInfo.module.css";

export function PixelInfo() {
    const coords = useContext(CoordinatesContext);

    if (coords.info.value === null) return null;

    if (coords.info.value === "loading") {
        return (
            <div className={styles.wrapper}>
                Исследуем...
            </div>
        )
    }

    const author = coords.info.value.author ?? "Без автора";

    return (
        <div className={styles.wrapper}>
            <p className={styles.info}>
                <strong className={styles.author}>{author}</strong>
                {coords.info.value.tag && <span className={styles.tag}>{coords.info.value.tag}</span>}
            </p>
        </div>
    )
}