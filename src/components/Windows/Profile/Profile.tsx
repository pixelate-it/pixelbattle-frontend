import { useContext, useEffect } from "preact/hooks";
import { ProfileContext } from "../../../managers/profile";
import { Button } from "../../General/Button/Button";
import styles from "./Profile.module.css";
import { Param } from "../../General/Param/Param";
import { WindowBox } from "../../WindowBox/WindowBox";
import { TagsContext } from "../../../managers/tags";
import { UserRole } from "../../../interfaces/Profile";

export function Profile() {
    const profile = useContext(ProfileContext)
    const tags = useContext(TagsContext)

    useEffect(() => {
        profile.load()

        if (profile.isAuthenticated.value) {
            profile.fetch().then(() => tags.select(profile.user.value?.tag ?? ""))
        };
    }, [])


    const params = {
        "ФИО": profile.user.value?.username,
        "Серия и номер": profile.user.value?.userID,
        "Группировка": profile.user.value?.tag,
        "Статус": {
            [UserRole.User]: null,
            [UserRole.Moderator]: "Мондиратор",
            [UserRole.Admin]: "Одмэн",
        }[profile.user.value?.role ?? UserRole.User],
        "Судимость": profile.user.value?.banned ? (profile.user.value?.banned.reason ?? "Не указана") : null,
        "Соц. рейтинг": profile.user.value?.points || 0
    }

    console.log(profile.user.value?.points.toString())


    return (
        profile.isAuthenticated.value
            ? (<WindowBox title="Паспорт">
                <div class={styles.wrapper}>
                    <div className={styles.params}>
                        {Object.entries(params).map(([label, value]) => {
                            if(!value && value !== 0) return null;

                            return <Param value={value.toString()} label={label} />
                            
                        })}
                    </div>

                    <Button href="/logout">Выпилиться</Button>
                </div>
            </WindowBox>)
            : (<div class={styles.login}>
                <Button href="/login">Впилиться</Button>
            </div>)

    )
}
