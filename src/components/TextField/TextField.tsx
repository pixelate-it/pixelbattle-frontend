import styles from "./TextField.module.css"

interface TextFieldProps {
    placeholder: string;
    onEnter?: (value: string) => void;
}

export function TextField({ placeholder }: TextFieldProps) {
    return (
        <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            onInput={e => console.log(e.currentTarget.value)} />
    )
}