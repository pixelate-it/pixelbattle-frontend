import { useContext } from "preact/hooks"
import styles from "./Snowflake.module.css"
import { SettingsContext } from "../../../managers/settings"
import { TargetedEvent } from "preact/compat"
import { Icon } from "../../General/Icon/Icon"

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
        <Icon icon="snowflake" size={35} viewBoxSize={272}/>
    </div>
}