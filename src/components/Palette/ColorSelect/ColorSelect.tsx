import { useContext } from "preact/hooks";
import { PaletteContext } from "../../../context/palette";
import { MyColor } from "../../../types/color"
import styles from "./ColorSelect.module.css"

interface ColorSelectProps {
    color: MyColor;
}

export function ColorSelect({ color }: ColorSelectProps) {
    const paletteContext = useContext(PaletteContext)

    return (
        <input 
            type="radio" 
            name="palette" 
            value={color.toHex()} 
            className={styles.color}
            style={{
                backgroundColor: color.toHex()
            }}
            checked={color.equals(paletteContext.palette.value.selected)}
            onChange={() => paletteContext.setCurrentColor(color)} />
    )
}