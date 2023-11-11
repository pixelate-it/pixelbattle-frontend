import { useContext } from "preact/hooks"
import { PaletteContext } from "../../../managers/palette"
import { ColorSelect } from "../ColorSelect/ColorSelect"
import styles from "./PaletteGroup.module.css"
import { ComponentChildren } from "preact"

interface PaletteGroupProps {
    children: ComponentChildren
}

export function PaletteGroup({ children }: PaletteGroupProps) {
    return (
        <div className={styles.group}>
            {children}
        </div>
    )
}