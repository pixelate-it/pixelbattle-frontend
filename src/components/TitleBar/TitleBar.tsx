import { useContext } from "preact/hooks";
import { Param } from "../Param/Param";
import styles from "./TitleBar.module.css";
import { InfoContext } from "../../managers/info";

export function TitleBar() {
    const info = useContext(InfoContext).info.value
    const isFinished = info.name === "season:blank"

    const name = isFinished ? "Без названия" : info.name
    const icon = isFinished ? "🏁" : ""

    // FIXME: It renders 2 times for some reason (why?)
    return (
        <details className={styles.wrapper}>
            <summary className={styles.title}>{name} {icon}</summary>
            <div className={styles.content}>
                <Param label="Кулдаун" value={info.cooldown + "мс"} />
                <Param label="Размер" value={info.size?.width + "x" + info.size?.height} />
                <Param label="Игроков" value={info.players?.online + "/" + info.players?.total} />
            </div>
        </details>
    )
}