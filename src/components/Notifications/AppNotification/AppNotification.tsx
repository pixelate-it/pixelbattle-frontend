import { useEffect, useState } from "preact/hooks";
import { NotificationInfo, NotificationsManager } from "../../../managers/notifications";
import styles from "./AppNotification.module.css";
import { useSignal } from "@preact/signals";
import { config } from "../../../config";
export function AppNotification({ notification }: { notification: NotificationInfo }) {
    const className = [styles.notification, styles[notification.type]].join(" ");
    const timeout = useSignal<NodeJS.Timeout>(setTimeout(() => {}, 0))


    useEffect(() => {
        timeout.value = setTimeout(() => {
            NotificationsManager.removeNotification(notification)
        }, config.time.notification)
    }, [])

    return (
        <div
            className={className}>

            <p className={styles.title}>{notification.title}</p>
            <p className={styles.message}>{notification.message}</p>
        </div>
    )
}