import { PixelInfo } from 'src/types/api'
import styles from './index.module.css'

export function Info({ info }: { info: PixelInfo | null | 'loading' }) {
  if (info === null) {
    return <div className={[styles.wrapper, styles.empty].join(' ')}>Пусто</div>
  }

  if (info === 'loading') {
    return (
      <div
        className={styles.wrapper}
        style={{
          animationDelay: '500ms',
          animationDuration: '500ms',
          opacity: info ? 1 : 0,
          transition: 'opacity 500ms'
        }}
      >
        Загрузка...
      </div>
    )
  }

  const author = info.author ?? 'Без автора'

  return (
    <div className={styles.wrapper}>
      <p className={styles.info}>
        <strong className={styles.author}>{author}</strong>
        {info.tag && <span className={styles.tag}>{info.tag}</span>}
      </p>
    </div>
  )
}
