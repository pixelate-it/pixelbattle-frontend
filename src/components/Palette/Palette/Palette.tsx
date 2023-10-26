import { useContext } from "preact/hooks";
import { PaletteGroup } from "../PaletteGroup/PaletteGroup";
import { PaletteContext } from "../../../context/palette";
import { ColorSelect } from "../ColorSelect/ColorSelect";
import { ColorCreate } from "../ColorCreate/ColorCreate";
import { ColorDelete } from "../ColorDelete/ColorDelete";
import { ColorPick } from "../ColorPick/ColorPick";
import styles from "./Palette.module.css"


export function Palette() {
    const colors = useContext(PaletteContext)

    return (
        <div className={styles.palette}>
            <PaletteGroup>
                {colors.palette.value.colors.map(color => <ColorSelect color={color} />)}
            </PaletteGroup>
            <hr className={styles.hr}/>
            <PaletteGroup>
                <ColorCreate />
                <ColorDelete />
                <ColorPick />
            </PaletteGroup>
        </div>
    )
}