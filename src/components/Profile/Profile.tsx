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
            profile.fetchProfile()

            return 
        };

        const token = new URLSearchParams(document.location.search).get("token")

        if (!token) return;

        profile.setToken(token)
        profile.save()
        profile.fetchProfile()
        

        document.location.replace(document.location.pathname)
    }, [])

    return (
        profile.isAuthenticated.value
            ? (<WindowBox title="Профиль">
                <div class={styles.wrapper}>
                    <div className={styles.params}>
                        <Param value={profile.user.value.username} label="Имя" />
                        <Param value={profile.user.value.userID} label="Айди" />
                        
                        {profile.user.value.tag && <Param value={profile.user.value.tag} label="Теги" />}
                        {profile.user.value.banned && <Param value={"Забанен"} label="Статус" />}
                    </div>

                    <Button href="/logout">Выйти</Button>
                </div>
            </WindowBox>)
            : (<div class={styles.login}>
                <Button href="/login">Войти</Button>
            </div>)

    )
}