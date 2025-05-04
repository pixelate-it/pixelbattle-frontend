import { ComponentChildren } from 'preact'
import { useState } from 'preact/hooks'
import styles from './index.module.styl'

interface WindowProps {
  children: ComponentChildren
  title: string
  showTip?: boolean
}

export function WindowBox({ children, title }: WindowProps) {
  const [opened, setOpened] = useState<boolean>(false)

  const click = () => {
    setOpened(!opened)
  }

  return (
    <div className={`${styles.window} ${opened ? styles.opened : ''}`}>
      <label htmlFor={styles.window} className={styles.title} onClick={click}>
        {title}
      </label>
      <div className={styles.content}>
        <div className={styles.container}>{children}</div>
      </div>
    </div>
  )
}
