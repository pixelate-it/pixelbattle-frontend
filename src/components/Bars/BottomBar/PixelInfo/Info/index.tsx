import { PixelInfo } from 'src/core/daemons/types'
import styles from './index.module.styl'

export function Info({
  info,
  color
}: {
  info: PixelInfo | null | 'loading'
  color: string
}) {
  if (info === null) {
    return <div className={[styles.wrapper, styles.empty].join(' ')}>Пусто</div>
  }

  if (info === 'loading') {
    return (
      <div
        className={styles.wrapper}
        style={{
          animationDelay: '0.5s',
          animationDuration: '0.5s',
          opacity: info ? 1 : 0,
          transition: 'opacity 0.5s, border-color 0.3s linear',
          '--selected': color
        }}
      >
        Загрузка...
      </div>
    )
  }

  const author = info.author ?? 'Без автора'

  return (
    <div
      className={styles.wrapper}
      style={{
        transition: 'opacity 0.5s, border-color 0.3s linear',
        '--selected': color
      }}
    >
      <p className={styles.info}>
        <strong className={styles.author}>{author}</strong>
        {info.tag && <span className={styles.tag}>{info.tag}</span>}
      </p>
    </div>
  )
}
