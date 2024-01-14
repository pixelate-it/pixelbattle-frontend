import { useContext } from "preact/hooks"
import styles from "./ColorPick.module.css"
import { ColorPickerContext } from "../../../managers/picker"
import { Icon } from "../../General/Icon/Icon"

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
            <Icon icon="color-picker" className={styles.icon} viewBoxSize={21}/>
        </div>
    )
}