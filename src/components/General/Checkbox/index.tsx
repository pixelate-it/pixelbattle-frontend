import { PropsWithChildren } from 'preact/compat'
import styles from './Checkbox.module.css'

interface CheckboxProps extends PropsWithChildren {
  name: string
  onChange: (value: boolean) => void
}

export function Checkbox({ children, onChange, name }: CheckboxProps) {
  return (
    <div class={styles.wrapper}>
      <input
        class={styles.input}
        type='checkbox'
        name={name}
        onChange={(event) => onChange(Boolean(event.currentTarget.checked))}
      />

      <label for={name} class={styles.label}>
        {children}
      </label>
    </div>
  )
}
