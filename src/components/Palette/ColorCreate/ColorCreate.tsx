import { useContext } from "preact/hooks";
import { PaletteContext } from "../../../context/palette";
import { MyColor } from "../../../types/color";
import styles from "./ColorCreate.module.css"

export function ColorCreate() {
    const palette = useContext(PaletteContext)

    return (
        <div className={styles.wrapper}>
            <input
                type="color"
                name="create-color"
                className={styles.input}
                value={MyColor.getRandom().toHex()}
                onInput={e => palette.addAndSelect(new MyColor(e.currentTarget.value))}/>
        </div>
    )
}