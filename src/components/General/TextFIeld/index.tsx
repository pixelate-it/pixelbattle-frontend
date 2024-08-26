import styles from './index.module.css'

interface TextFieldProps {
  placeholder: string
  value?: string
  onInput: (value: string) => void
  min?: number
  max?: number
  type?: 'text' | 'number'
  defaultValue?: string
}

export const TextField = ({
  placeholder,
  onInput,
  min,
  max,
  type = 'text',
  defaultValue,
  value
}: TextFieldProps) => {
  return (
    <input
      type={type}
      className={styles.input}
      value={value}
      placeholder={placeholder}
      onInput={(event) => onInput(event.currentTarget.value)}
      defaultValue={defaultValue}
      minLength={min}
      maxLength={max}
      min={min}
      max={max}
    />
  )
}
