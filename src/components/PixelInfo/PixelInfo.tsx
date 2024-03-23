import { useContext } from "preact/hooks";
import { CoordinatesContext } from "../../managers/coordinates";
import styles from "./PixelInfo.module.css";

export function PixelInfo() {
    const coords = useContext(CoordinatesContext);

    if (coords.info.value === null) {
        return <div className={[styles.wrapper, styles.empty].join(" ")}>
            Пусто
        </div>;
    }

    if (coords.info.value === "loading") {
        return (
            <div className={styles.wrapper} style={{
                animationDelay: '500ms',
                animationDuration: '500ms',
                opacity: coords.info.value ? 1 : 0,
                transition: 'opacity 500ms'
            }}>
                Загрузка...
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