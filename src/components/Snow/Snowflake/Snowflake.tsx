import { useContext } from "preact/hooks"
import styles from "./Snowflake.module.css"
import { SettingsContext } from "../../../managers/settings"
import { TargetedEvent } from "preact/compat"

export function Snowflake() {
    const settings = useContext(SettingsContext)

    function toggleSnow(event: TargetedEvent<HTMLInputElement>): void {
        settings.settings.value = {
            ...settings.settings.value,
            enableSnow: (event.target as HTMLInputElement).checked
        }

        settings.save()
    }

    return <div className={styles.wrapper}>
        <input type="checkbox" className={styles.input} onChange={toggleSnow} defaultChecked={settings.settings.value.enableSnow}/>
        <img
            src="/images/icons/snowflake.svg"
            alt="Snowflake"
            width={35}
            height={35}
        />
    </div>
}