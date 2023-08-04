import { Modal } from "../api/modal";

export const modals = {
    "ENDED": new Modal({
        title: "Игра закончена",
        type: "info",
        description: "Ждите новую игру!",
    }),
    "NOT_AUTH": new Modal({
        title: "Вы не авторизованы",
        type: "error",
        description: "Пожалуйста, авторизуйтесь",
    }),
    "BANNED": new Modal({
        title: "Вы забанены",
        type: "error",
        description: "Если произошла ошибка, обратитесь к администратору",
    }),
} as const