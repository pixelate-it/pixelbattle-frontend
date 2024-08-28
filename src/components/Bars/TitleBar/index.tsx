import { useState } from 'preact/hooks'
import { InfoStore } from 'src/managers/info'
import { InfoState } from 'src/types/managers'
import styles from './index.module.css'
import { Param } from 'src/components/General/Param'
import { ComputedActions, useStoreComputed } from 'src/hooks/useStoreComputed'

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
        <label for={styles.window} className={styles.title}>
          {name} {icon}
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
                  {/* {Object.entries(config.media).map(([name, url]) => (
                    <a
                      href={url[0]}
                      target='_blank'
                      rel='noopener noreferrer'
                      key={name}
                    >
                      <Icon
                        icon={name}
                        alt={url[1]}
                        size={35}
                        viewBoxSize={256}
                      />
                      {/* <img src={`/images/icons/${name}.svg`} alt={name} width={35} height={35}/> }
                    </a>
                  ))} */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
