import { useContext, useState } from "preact/hooks";
import { PaletteContext } from "../../../managers/palette";
import { AppColor } from "../../../types/AppColor";
import styles from "./ColorCreate.module.css"
import { HexAlphaColorPicker, HexColorInput, HexColorPicker } from "react-colorful";
import "./ColorPicker.css"
import { Button } from "../../General/Button/Button";

export function ColorCreate() {
    const palette = useContext(PaletteContext);
    const [color, setColor] = useState(palette.palette.value.selected.toHex());
    const [open, setOpen] = useState(false);

    function onSelect() {
        setOpen(!open)

        palette.addAndSelect(new AppColor(color))
    }

    function toggle() {
        setOpen(!open)
    }

    function openPicker() {
        setColor(palette.palette.value.selected.toHex())

        toggle()
    }

    return (
        <div className={styles.wrapper}>
            {open ?
                (<div className="color-picker">
                    <HexColorPicker color={color} onChange={setColor} />
                    <HexColorInput color={color} onChange={setColor} prefixed />
                    <div className={styles.buttons}>
                        <Button onClick={onSelect}>
                            Готово
                        </Button>
                        <Button onClick={toggle} type="danger">
                            Отмена
                        </Button>
                    </div>

                </div>)
                : null}


            <button onClick={openPicker} className={styles.button}>
                <img
                    width={15}
                    height={15}
                    src="/images/icons/plus.svg"
                    className={styles.icon} />
            </button>

            {/* <input
                type="color"
                name="create-color"
                className={styles.input}
                value={AppColor.getRandom().toHex()}
                onChange={e => palette.addAndSelect(new AppColor(e.currentTarget.value))}/> */}

        </div>
    )
}