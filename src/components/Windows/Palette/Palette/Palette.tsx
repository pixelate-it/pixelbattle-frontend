import { useContext } from "preact/hooks";
import { PaletteGroup } from "../PaletteGroup/PaletteGroup";
import { PaletteContext } from "../../../../managers/palette";
import { CursorContext } from "../../../../managers/cursor";
import { ColorSelect } from "../ColorSelect/ColorSelect";
import { ColorCreate } from "../ColorCreate/ColorCreate";
import { ColorDelete } from "../ColorDelete/ColorDelete";
import { ColorPick } from "../ColorPick/ColorPick";
import styles from "./Palette.module.css";


export function Palette() {
    const palette = useContext(PaletteContext)
    const cursor = useContext(CursorContext);

    palette.load()
    cursor.setColor(palette.palette.value.selected)

    return (
        <div className={styles.palette}>
            <PaletteGroup>
                {palette.palette.value.colors.map(color => <ColorSelect color={color} />)}
            </PaletteGroup>
            <hr className={styles.hr} />
            <PaletteGroup>
                <ColorPick />
                <ColorCreate />
                <ColorDelete />
            </PaletteGroup>
        </div>
    )
}