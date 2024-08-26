import { CooldownStore } from 'src/managers/cooldown'
import styles from './index.module.css'
import { useStore } from 'src/hooks/useStore'

export const Cooldown = () => {
  const cooldown = useStore(CooldownStore)

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
