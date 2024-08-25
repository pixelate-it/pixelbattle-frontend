import styles from './index.module.css'

export function Coordinates({
  coordinates,
  empty
}: {
  coordinates: [number, number]
  empty: boolean
}) {
  if (empty) {
    // Fixes jumping when sidebar in scroll mode
    return <p className={[styles.coordinates, styles.empty].join(' ')}>Пусто</p>
  }

  return (
    <p
      className={styles.coordinates}
      style={{
        animationDelay: '500ms',
        animationDuration: '500ms',
        opacity: 1,
        transition: 'opacity 500ms'
      }}
    >
      {coordinates[0] + ', ' + coordinates[1]}
    </p>
  )
}
