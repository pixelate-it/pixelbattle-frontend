import styles from './index.module.styl'

export function Coordinates({
  coordinates,
  empty,
  color
}: {
  coordinates: [number, number]
  empty: boolean
  color: string
}) {
  if (empty) {
    // Fixes jumping when sidebar in scroll mode
    return (
      <p
        className={[styles.coordinates, styles.empty].join(' ')}
        style={{ '--selected': color }}
      >
        Пусто
      </p>
    )
  }

  return (
    <p
      className={styles.coordinates}
      style={{
        animationDelay: '0.5s',
        animationDuration: '0.5s',
        opacity: 1,
        transition: 'opacity 0.5s, border-color 0.3s linear',
        '--selected': color
      }}
    >
      {coordinates[0] + ', ' + coordinates[1]}
    </p>
  )
}
