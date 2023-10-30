import { ComponentChildren } from "preact";
import styles from "./Button.module.css"

interface BaseButton {
    children: ComponentChildren;
}

interface LinkButton {
    href: string;
}

interface ActionButton {
    onClick: () => void;
}

type ButtonProps = BaseButton & (LinkButton | ActionButton);

export function Button(props: ButtonProps) {
    if ("href" in props) {
        return (
            <a href={props.href} className={styles.button}>
                {props.children}
            </a>
        )
    }

    return (
        <button className={styles.button} onClick={props.onClick}>
            {props.children}
        </button>
    )
}