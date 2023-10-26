import { ComponentChildren } from "preact";

interface ButtonProps {
    children: ComponentChildren
    href?: string;
}


export function Button({ children, href}: ButtonProps) {
    return <a href={href}>{children}</a>
}