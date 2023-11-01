import { useContext } from "preact/hooks"
import { PaletteContext } from "../../../managers/palette"
import styles from "./ColorDelete.module.css"

export function ColorDelete() {
    const palette = useContext(PaletteContext)

    return (
        <button
            className={styles.button}
            onClick={() => palette.removeColor(palette.palette.value.selected)}
            disabled={palette.isDefaultColor(palette.palette.value.selected)}>
            <img
                width={15}
                height={15}
                src="/images/icons/plus.svg"
                className={styles.icon} />
        </button>
    )
}