import { signal } from "@preact/signals";
import { createContext } from "preact";

export interface NotificationInfo {
    message: string;
    title: string;
    type: "error" | "success";
    id: string;
}


export const NotificationsManager = {
    notifications: signal([] as NotificationInfo[]),
    addNotification(notification: Omit<NotificationInfo, "id">) {
        if (NotificationsManager.notifications.value.length >= 5) {
            NotificationsManager.notifications.value = NotificationsManager.notifications.value.slice(1)
        }

        NotificationsManager.notifications.value = [
            ...NotificationsManager.notifications.value,
            {
                ...notification,
                id: Math.random().toString()
            }
        ]
    },
    removeNotification(id: string) {
        NotificationsManager.notifications.value = NotificationsManager.notifications.value.filter(n => n.id !== id)
    }
}

export const NotificationsContext = createContext({} as typeof NotificationsManager)