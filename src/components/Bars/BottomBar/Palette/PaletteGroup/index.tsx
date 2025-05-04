import { ComponentChildren } from 'preact'
import styles from './index.module.styl'

interface PaletteGroupProps {
  children: ComponentChildren
}

export const PaletteGroup = ({ children }: PaletteGroupProps) => {
  return <div className={styles.group}>{children}</div>
}
