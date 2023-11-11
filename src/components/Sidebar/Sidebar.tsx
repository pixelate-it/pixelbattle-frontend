import { ComponentChildren } from "preact"
import { Tags } from "../Tags/Tags/Tags"
import styles from "./Sidebar.module.css"
import { Profile } from "../Profile/Profile"
import { NotificationList } from "../Notifications/NotificationList/NotificationList"


export function Sidebar() {
    return <div className={styles.sidebar}>
        <Tags />
        <Profile />
        <NotificationList />
    </div>
}
