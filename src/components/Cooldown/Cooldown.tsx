import { useContext, useEffect } from "preact/hooks"
import { PlaceContext } from "../../managers/place";
import styles from "./Cooldown.module.css"
import { CooldownContext } from "../../managers/cooldown";
import { computed } from "@preact/signals";

export function Cooldown() {
    const cooldown = useContext(CooldownContext);

    if (!cooldown.hasCooldown.value) return null
    
    return (
        <div className={styles.wrapper}>
            <progress className={styles.progress} value={cooldown.cooldown} max="100"></progress>
            <p className={styles.label}>{cooldown.cooldown.value}%</p>
        </div>
    )
}