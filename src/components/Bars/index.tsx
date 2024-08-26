import { Notifications } from '../Notifications'
import { BottomBar } from './BottomBar'
import styles from './index.module.css'
import { SideBar } from './SideBar'
import { TitleBar } from './TitleBar'

export const Bars = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <TitleBar />
        <SideBar />
        <BottomBar />

        <Notifications />
      </div>
    </>
  )
}
