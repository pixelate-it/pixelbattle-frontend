import { ComponentChildren } from "preact";
import styles from "./WindowBox.module.css";

interface WindowProps {
    children: ComponentChildren;
    title: string;
    showTip?: boolean
}

export function WindowBox({ children, title }: WindowProps) {
    return (
        <details className={styles.window}>
            <summary className={styles.title}>{title}</summary>

            <div className={styles.content}>
                {children}
            </div>
        </details>
    )
}