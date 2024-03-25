import { NotificationInfo } from "../managers/notifications";

type NotificationMap = {
    [key: string]: Omit<NotificationInfo, "id" | "type">;
}

export const ServerNotificationMap: NotificationMap = {
    "UserCooldown": {
        title: "Твоя любимая ошибка (С)",
        message: "ПОДОЖДИТЕ ПАРУ СЕКУНД"
    },
    "RateLimit": {
        title: "Ты знаешь кто я? (С)",
        message: "Не DDoS' сайт пж"
    },
    "TokenBanned": {
        title: "Хаха, нельзя рисовать (С)",
        message: "А вот не надо было правила нарушать"
    },
    "NotAuthorized": {
        title: "Представься (С)",
        message: "Впились для начала"
    },
}

export const ClientNotificationMap: NotificationMap = {
    "Banned": {
        title: "Хаха, нельзя рисовать",
        message: "А вот не надо было правила нарушать",
    },
    "Cooldown": {
        title: "Твоя любимая ошибка",
        message: "Подождите пару секунд",
    },
    "Not logged": {
        title: "Необходимо авторизоваться",
        message: "Вы не вошли в дискорд аккаунт",
    },
    "Game ended": {
        title: "А вот и всё!",
        message: "Больше не поиграешь, увы",
    },
}