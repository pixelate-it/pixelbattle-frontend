import styles from './index.module.css'
import { Param } from 'src/components/General/Param'
import { config } from 'src/config.ts'
import { Icon } from '../../General/Icon'
import { useTitleBar } from 'src/hooks/useTitleBar.ts'

export const TitleBar = () => {
  const { opened, click, info, icon, show } = useTitleBar()

  if (info.name === 'Загрузка...') {
    /*
     * Mirdukkkkk please make styles for this!
     *
     * oke, it will be done!
     */
    return <div>Загрузка...</div>
  }

  return (
    <>
      <div
        className={`${styles.window} ${opened ? styles.opened : styles.closed}`}
        onClick={click}
      >
        <label htmlFor={styles.window} className={styles.title}>
          {icon} {info.name}
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
                  {Object.entries(config.media).map(([name, url]) => (
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
