import { useContext } from "preact/hooks"
import { PaletteContext } from "../../../context/palette"
import styles from "./ColorDelete.module.css"

export function ColorDelete() {
    const palette = useContext(PaletteContext)

    return (
        <button 
            className={styles.button}
            onClick={() => palette.removeColor(palette.palette.value.selected)}></button>
    )
}