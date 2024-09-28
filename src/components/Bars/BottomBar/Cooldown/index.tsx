import styles from './index.module.css'
import { useCooldown } from 'src/hooks/useCooldown'

export const Cooldown = () => {
  const cooldown = useCooldown()

  if (!cooldown.hasCooldown) return null

  return (
    <div className={styles.wrapper}>
      <progress
        className={styles.progress}
        value={cooldown.progress}
        max='100'
      ></progress>
      <p className={styles.label}>{cooldown.progress.toFixed(0)}%</p>
    </div>
  )
}
