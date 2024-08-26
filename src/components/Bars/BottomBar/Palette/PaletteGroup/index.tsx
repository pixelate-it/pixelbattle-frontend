import styles from './index.module.css'
import { ComponentChildren } from 'preact'

interface PaletteGroupProps {
  children: ComponentChildren
}

export const PaletteGroup = ({ children }: PaletteGroupProps) => {
  return <div className={styles.group}>{children}</div>
}
