import { useContext, useEffect, useState } from "preact/hooks";
import { Param } from "../../General/Param/Param";
import styles from "./TitleBar.module.css";
import { InfoContext } from "../../../managers/info";
import { PlaceContext } from "../../../managers/place";
import { effect, useSignal } from "@preact/signals";
import { config } from "../../../config";
import { Snowflake } from "../../Snow/Snowflake/Snowflake";

export function TitleBar() {
    const info = useContext(InfoContext)
    const place = useContext(PlaceContext)
    const [infoIntervalId, setInfoIntervalId] = useState<NodeJS.Timeout>()

    useEffect(() => {
        info.fetch();

        setInfoIntervalId(setInterval(info.fetch, config.time.update.info))
    }, [])

    if (info.info.value === null || place.image.value === null) {
        return null
    }


    const isFinished = info.info.value.ended

    const name = info.info.value.name === "season:blank" ? "Без названия" : info.info.value.name
    const icon = isFinished ? "🏁" : "⚔️";


    return (
        <details className={styles.wrapper}>
            <summary className={styles.title}>{name} {icon}</summary>
            <div className={styles.content}>
                <div className={styles.params}>
                    <Param label="Кулдаун" value={info.info.value.cooldown + "мс"} />
                    <Param label="Размер" value={place.image.value.size.x + "x" + place.image.value.size.y} />
                    <Param label="Онлайн" value={info.info.value.online.toString()} />
                </div>
                <div className={styles.icons}>
                    <div className={styles.media}>
                        {Object.entries(config.media).map(([name, url]) => (
                            <a href={url} target="_blank" rel="noopener noreferrer" key={name}>
                                <img src={`/images/icons/${name}.svg`} alt={name} width={35} height={35}/>
                            </a>
                        ))}
                    </div>
                    <Snowflake />
                </div>
                

            </div>
        </details>
    )
}