import { useContext } from "preact/hooks"
import { OverlayContext } from "../../../managers/overlay"
import { TextField } from "../../General/TextField/TextField"
import styles from "./OverlayTransform.module.css"
import { Button } from "../../General/Button/Button"
import { Icon } from "../../General/Icon/Icon"
import { PlaceContext } from "../../../managers/place"

export function OverlayTransform() {
    const overlay = useContext(OverlayContext)
    const place = useContext(PlaceContext)

    function changeCoords(type: "x" | "y", value: number) {
        const newPosition = overlay.position.value!.clone()

        newPosition[type] = value;

        overlay.position.value = newPosition
    }

    return <div class={styles.wrapper}>
        <div class={styles.image}>
            <p class={styles.imageName}>{overlay.imageName}</p>
            <Button onClick={overlay.unsetImage} type="danger">
                <Icon icon="plus" className={styles.removeIcon} />
            </Button>
        </div>
        <div class={styles.coordinates}>
            <TextField
                min={0}
                max={place.image.value?.size.x}
                type="number"
                placeholder="X координата"
                defaultValue={overlay.position.value!.x.toString()}
                onInput={(input) => changeCoords("x", parseInt(input))} />
            <TextField
                min={0}
                max={place.image.value?.size.y}
                type="number"
                placeholder="Y координата"
                defaultValue={overlay.position.value!.y.toString()}
                onInput={(input) => changeCoords("y", parseInt(input))} />
        </div>
    </div>
}