import { useLoadScreen } from 'src/hooks/useLoadScreen'
import styles from './index.module.css'
import { GeneralStatus } from 'src/core/daemons/types'

export const LoadScreen = () => {
  const { status, info, attempts, error } = useLoadScreen()

  if (status === GeneralStatus.CORRECT) return <></>

  return (
    <div className={styles.wrapper}>
      <img src='/public/images/meta/favicon.svg' width='64'></img>
      <h1>{info.title}</h1>
      {attempts !== 0 && <p>Попытка переподключиться: {attempts}</p>}
      {status === GeneralStatus.CONNECTING && (
        <>
          <h2>{info.recommendations[0]}</h2>
          <ul>
            {info.recommendations.map((r, index) =>
              index !== 0 ? <li>{r}</li> : <></>
            )}
          </ul>
        </>
      )}

      {status === GeneralStatus.INTERNAL_ERROR && (
        <div className={styles.errorsWrapper}>
          <details title={'Информация об сбое'}>{error}</details>
        </div>
      )}
    </div>
  )
}
