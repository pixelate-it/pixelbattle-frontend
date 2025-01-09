import { useLoadScreen } from 'src/hooks/useLoadScreen'
import styles from './index.module.css'
import { WebSocketError } from 'src/core/util/Errors'

export const LoadScreen = () => {
  const { info, all } = useLoadScreen()

  if (info.ready) return <></>

  return (
    <div className={styles.wrapper}>
      <img src='/public/images/meta/favicon.svg' width='64'></img>
      <h1>{all.title}</h1>
      {all.isConnectionError && (
        <ul>
          {(info.error! as WebSocketError).reasons.map((r) => (
            <li>{r}</li>
          ))}
        </ul>
      )}
      {info.reconnecting && <p>Попытка переподключиться: {info.attempts}</p>}
      {import.meta.env.VITE_DEV_MODE && all.isCritical && (
        <details title={'Детальней'}>
          <p>{all.message}</p>
        </details>
      )}
      {!import.meta.env.VITE_DEV_MODE && all.isCritical && (
        <details title={'Что делать?'}>
          <p>
            Вы можете написать разработчикам об ошибке, и отослать информацию
            ниже
          </p>
          <details title={'Информация об сбое'}>
            <p>{all.message}</p>
          </details>
        </details>
      )}
    </div>
  )
}
