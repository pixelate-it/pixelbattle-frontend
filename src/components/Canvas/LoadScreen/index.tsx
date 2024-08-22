import styles from './index.module.css'

export const LoadScreen = () => {
  return (
    <div className={styles.wrapper}>
      <img src='/public/images/meta/favicon.svg' width='64'></img>
      <p>Загрузка холста..</p>
    </div>
  )
}
