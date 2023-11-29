import { NotificationInfo } from "../managers/notifications"

type NotificationMap = {
    [key: string]: Omit<NotificationInfo, "id" | "type">
}

export const ServerNotificationMap: NotificationMap = {
    "UserCooldown": {
        title: "Кулдаун активен (С)",
        message: "Подождите пару секунд"
    },
    "RateLimit": {
        title: "Рейт лимит (С)",
        message: "Подождите пару секунд"
    },
    "TokenBanned": {
        title: "Аккаунт забанен (С)",
        message: "Ваш аккаунт забанен"
    },
    "NotAuthorized": {
        title: "Необходимо авторизоваться (С)",
        message: "Вы не вошли в дискорд аккаунт"
    },
    "Unknown": {
        title: "Неизвестная ошибка (С)",
        message: "Неизвестная ошибка"
    },
}

export const ClientNotificationMap: NotificationMap = {
    "Banned": {
        title: "Аккаунт забанен",
        message: "Ваш аккаунт забанен",
    },
    "Cooldown": {
        title: "Подождите пару секунд",
        message: "Кулдаун активен",
    },
    "Not logged": {
        title: "Необходимо авторизоваться",
        message: "Вы не вошли в дискорд аккаунт",
    },
    "Game ended": {
        title: "Ждите новой игры",
        message: "Игра окончена",
    },
}