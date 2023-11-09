import { useContext } from "preact/hooks";
import { PaletteContext } from "../../../managers/palette";
import { AppColor } from "../../../types/AppColor";
import styles from "./ColorCreate.module.css"

export function ColorCreate() {
    const palette = useContext(PaletteContext)

    return (
        <div className={styles.wrapper}>
            <input
                type="color"
                name="create-color"
                className={styles.input}
                value={AppColor.getRandom().toHex()}
                onChange={e => palette.addAndSelect(new AppColor(e.currentTarget.value))}/>
            <img 
                width={15}
                height={15}
                src="/images/icons/plus.svg" 
                className={styles.icon} />
        </div>
    )
}