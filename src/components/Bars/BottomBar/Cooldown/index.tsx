import { useCooldown } from 'src/hooks/useCooldown'
import styles from './index.module.styl'

export const Cooldown = ({ color }: { color: string }) => {
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
