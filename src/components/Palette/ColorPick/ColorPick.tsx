import { useContext } from "preact/hooks"
import styles from "./ColorPick.module.css"
import { ColorPickerContext } from "../../../managers/picker"

export function ColorPick() {
    const picker = useContext(ColorPickerContext)

    return (
        <div className={styles.wrapper}>

            <input 
                type="checkbox" 
                name="color-pick" 
                className={styles.input} 
                onInput={() => picker.toggle()}
                checked={picker.isEnabled.value}/>
            <img width={15} height={15} src="/images/icons/color-picker.svg" className={styles.icon} />
        </div>
    )
}