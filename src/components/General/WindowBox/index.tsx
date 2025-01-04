import { ComponentChildren } from 'preact'
import styles from './index.module.css'
import { useEffect, useRef, useState } from 'preact/hooks'

interface WindowProps {
  children: ComponentChildren
  title: string
  showTip?: boolean
}

export function WindowBox({ children, title }: WindowProps) {
  const [opened, setOpened] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  // const canvasRef = useRef<HTMLCanvasElement>(null)
  // const divRef = useRef<HTMLDivElement>(null)

  const click = () => {
    setOpened(!opened)
  }

  useEffect(() => {
    setTimeout(() => {
      setShow(true)
    }, 1000)

    // const observer = new ResizeObserver((entries) => {
    //   console.log(entries[0].contentRect)
    // })

    // if (divRef.current) {
    //   observer.observe(divRef.current)
    // }

    // return () => {
    //   observer.disconnect()
    // }
  }, [])

  return (
    <div
      className={`${styles.window} ${opened ? styles.opened : styles.closed}`}
      // ref={divRef}
    >
      {/* <canvas ref={canvasRef} /> */}
      <label htmlFor={styles.window} className={styles.title} onClick={click}>
        {title}
      </label>
      <div className={styles.content}>
        {show && <div className={styles.container}>{children}</div>}
      </div>
    </div>
  )
}
