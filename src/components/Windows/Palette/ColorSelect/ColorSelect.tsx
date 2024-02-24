import { useContext } from "preact/hooks";
import { PaletteContext } from "../../../../managers/palette";
import { AppColor } from "../../../../classes/AppColor";
import styles from "./ColorSelect.module.css";

interface ColorSelectProps {
    color: AppColor;
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