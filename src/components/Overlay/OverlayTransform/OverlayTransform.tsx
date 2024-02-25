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
        overlay.save()
    }

    function changeOpacity(opacity: string) {
        overlay.opacity.value = parseInt(opacity)
        overlay.save()
    }

    return <div class={styles.wrapper}>
        <div class={styles.image}>
            <p class={styles.imageName}>{overlay.imageName}</p>
            <Button onClick={overlay.unsetImage} type="danger">
                <Icon icon="plus" className={styles.removeIcon} />
            </Button>
        </div>
        <div class={styles.groups}>
            <div class={styles.group}>
                <p class={styles.groupTitle}>Координаты</p>
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
            <div class={styles.group}>
                <p class={styles.groupTitle}>Прозрачность</p>
                <TextField
                    min={0}
                    max={100}
                    type="number"
                    placeholder="Прозрачность"
                    defaultValue={overlay.opacity.value!.toString()}
                    onInput={changeOpacity} />
            </div>




        </div>
    </div>
}