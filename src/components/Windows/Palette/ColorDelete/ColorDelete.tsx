import { useContext } from "preact/hooks";
import { PaletteContext } from "../../../../managers/palette";
import styles from "./ColorDelete.module.css";
import { Icon } from "../../../General/Icon/Icon";

export function ColorDelete() {
    const palette = useContext(PaletteContext)

    function onClick(event: MouseEvent) {
        if (event.shiftKey) {
            palette.reset()

            return;
        }

        palette.removeColor(palette.palette.value.selected)
    }

    return (
        <button
            className={styles.button}
            onClick={onClick}
            disabled={palette.isDefaultColor(palette.palette.value.selected)}>

            <Icon icon="plus" className={styles.icon} alt={"Удалить выбранный цвет"}/>
        </button>
    )
}