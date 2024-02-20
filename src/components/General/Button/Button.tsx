import { ComponentChildren } from "preact";
import styles from "./Button.module.css";

interface BaseButton {
    children: ComponentChildren;
    type?: "primary" | "danger"
}

interface LinkButton {
    href: string;
}

interface ActionButton {
    onClick: () => void;
}

type ButtonProps = BaseButton & (LinkButton | ActionButton);

export function Button(props: ButtonProps) {
    const className = [styles.button, styles[props.type ?? "primary"]].join(" ")

    if ("href" in props) {
        return (
            <a href={props.href} className={className}>
                {props.children}
            </a>
        )
    }

    return (
        <button className={className} onClick={props.onClick}>
            {props.children}
        </button>
    )
}