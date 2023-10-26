import styles from "./ColorPick.module.css"

export function ColorPick() {
    return (
        <input type="checkbox" name="color-pick" className={styles.input}/>
    )
}