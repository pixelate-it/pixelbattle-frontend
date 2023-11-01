import { signal } from "@preact/signals";
import { createContext } from "preact";

export interface NotificationInfo {
    message: string;
    title: string;
    type: "error" | "success";
}


export const NotificationsManager = {
    notifications: signal([] as NotificationInfo[]),
    addNotification(notification: NotificationInfo) {
        if (NotificationsManager.notifications.value.length >= 5) {
            NotificationsManager.notifications.value = NotificationsManager.notifications.value.slice(1)
        }

        NotificationsManager.notifications.value = [
            ...NotificationsManager.notifications.value,
            notification
        ]
    },
    removeNotification(notification: NotificationInfo) {
        NotificationsManager.notifications.value = NotificationsManager.notifications.value.filter(n => n !== notification)
    }
}

export const NotificationsContext = createContext({} as typeof NotificationsManager)