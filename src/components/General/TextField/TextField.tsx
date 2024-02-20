import styles from "./TextField.module.css";

interface TextFieldProps {
    placeholder: string;
    onInput?: (event: Event) => void;
    min?: number;
    max?: number;
}

export function TextField({ placeholder, onInput, min, max }: TextFieldProps) {
    return (
        <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            onInput={onInput} 
            minLength={min}
            maxLength={max}/>
    )
}