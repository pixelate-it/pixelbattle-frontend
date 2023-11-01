import { useContext } from "preact/hooks"
import { NotificationsContext } from "../../../managers/notifications"
import styles from "./NotificationList.module.css"
import { AppNotification } from "../AppNotification/AppNotification"


export function NotificationList() {
    const notifications = useContext(NotificationsContext)

    return (
        <div className={styles.notifications}>
            {
                notifications.notifications.value.map((notification, index) =>
                    <AppNotification key={index} notification={notification} />
                )
            }
        </div>
    )
}