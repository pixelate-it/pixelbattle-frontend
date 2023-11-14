import { useContext, useEffect, useLayoutEffect } from "preact/hooks";
import { ProfileContext } from "../../managers/profile";
import { Button } from "../Button/Button";
import styles from "./Profile.module.css";
import { Param } from "../Param/Param";
import { WindowBox } from "../WindowBox/WindowBox";

export function Profile() {
    const profile = useContext(ProfileContext)

    useEffect(() => {
        profile.load()

        if (profile.isAuthenticated.value) {
            profile.fetch()

            return 
        };

        const params = new URLSearchParams(document.location.search)

        const token = params.get("token")
        if (!token) return;

        const id = params.get("id")
        if (!id) return;

        profile.login(token, id)
        profile.save()
        profile.fetch()
        

        document.location.replace(document.location.pathname)
    }, [])


    const params = {
        "Имя": profile.user.value.username,
        "Айди": profile.user.value.userID,
        "Тег": profile.user.value.tag,
        "Статус": profile.user.value.banned ? "Забанен" : null,
        "Роль": profile.user.value.isMod ? "Модератор" : null
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
                <Button href="/login">Войти</Button>
            </div>)

    )
}