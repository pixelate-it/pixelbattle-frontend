import styles from './index.module.styl'

interface ParamProps {
  label: string
  value: string
}

export function Param({ label, value }: ParamProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>{label}</p>
      <p className={styles.value}>{value}</p>
    </div>
  )
}
