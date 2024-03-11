import { useContext, useEffect } from "preact/hooks";
import { ProfileContext } from "../../../managers/profile";
import { Button } from "../../General/Button/Button";
import styles from "./Profile.module.css";
import { Param } from "../../General/Param/Param";
import { WindowBox } from "../../WindowBox/WindowBox";
import { TagsContext } from "../../../managers/tags";
import { UserRole } from "../../../interfaces/Profile";
import { ModalContext } from "../../../managers/modal";
import { Checkbox } from "../../General/Checkbox/Checkbox";
import { ProfileLoginBody } from "./ProfileLoginBody/ProfileLoginBody";



export function Profile() {
    const profile = useContext(ProfileContext)
    const tags = useContext(TagsContext)
    const modal = useContext(ModalContext)

    useEffect(() => {
        profile.load()

        if (profile.isAuthenticated.value) {
            profile.fetch().then(() => tags.select(profile.user.value?.tag ?? ""))
        };
    }, [])


    const params = {
        "Имя": profile.user.value?.username,
        "Айди": profile.user.value?.userID,
        "Тег": profile.user.value?.tag,
        "Статус": profile.user.value?.banned ? `Забанен по причине "${profile.user.value?.banned.reason ?? "Не указано"}"` : null,
        "Роль": {
            [UserRole.User]: null,
            [UserRole.Moderator]: "Модератор",
            [UserRole.Admin]: "Админ",
        }[profile.user.value?.role ?? UserRole.User]
    }


    return (
        profile.isAuthenticated.value
            ? (<WindowBox title="Профиль">
                <div class={styles.wrapper}>
                    <div className={styles.params}>
                        {Object.entries(params).map(([label, value]) => {
                            if (!value) return null;

                            return <Param value={value} label={label} />
                        })}
                    </div>

                    <Button href="/logout">Выйти</Button>
                </div>
            </WindowBox>)
            : (<div class={styles.login}>
                <Button onClick={() => modal.open("Вход", <ProfileLoginBody />)}>Войти</Button>
            </div>)

    )
}
