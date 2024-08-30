import { useState } from 'preact/hooks'
import { InfoStore } from 'src/managers/info'
import { InfoState } from 'src/types/managers'
import styles from './index.module.css'
import { Param } from 'src/components/General/Param'
import { ComputedActions, useStoreComputed } from 'src/hooks/useStoreComputed'
import { AppConfig } from '../../../classes/AppConfig.ts'
import { Icon } from '../../General/Icon'

interface ComputedValues<T> extends ComputedActions<T> {
  name: (value: T) => string
  icon: (value: T) => string
  show: (value: T) => boolean
}

export const TitleBar = () => {
  const [info, { name, icon, show }] = useStoreComputed<
    InfoState,
    ComputedValues<NonNullable<InfoState>>
  >(InfoStore, {
    name: ({ name }) => (name === 'season:blank' ? 'Без названия' : name),
    icon: ({ ended }) => (ended ? '🏁' : '⚔️'),
    show: (s) => s.canvas !== undefined
  })
  const [opened, setOpened] = useState<boolean>(false)

  if (info.name === 'Загрузка...') {
    /*
     * Mirdukkkkk please make styles for this!
     *
     * oke, it will be done!
     */
    return <div>Загрузка...</div>
  }

  const click = () => {
    setOpened(!opened)
  }

  return (
    <>
      <div
        className={`${styles.window} ${opened ? styles.opened : styles.closed}`}
        onClick={click}
      >
        <label htmlFor={styles.window} className={styles.title}>
          {icon} {name}
        </label>
        <div className={styles.content}>
          {show && (
            <div className={styles.container}>
              <div className={styles.params}>
                <Param label='Кулдаун' value={info.cooldown + 'мс'} />
                <Param
                  label='Размер'
                  value={info.canvas.width + 'x' + info.canvas.height}
                />
                <Param label='Онлайн' value={info.online.toString()} />
              </div>
              <div className={styles.icons}>
                <div className={styles.media}>
                  {Object.entries(AppConfig.media).map(([name, url]) => (
                    <a
                      href={url[0]}
                      target='_blank'
                      rel='noopener noreferrer'
                      key={name}
                    >
                      <Icon icon={name} alt={url[1]} size={35} viewBoxSize={256} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
