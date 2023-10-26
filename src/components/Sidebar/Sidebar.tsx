import { ComponentChildren } from "preact"
import { TagList } from "../Tags/TagWindow/TagWindow"
import styles from "./Sidebar.module.css"
import { WindowBox } from "../WindowBox/WindowBox"


export function Sidebar() {
    return <div className={styles.sidebar}>
        <WindowBox title="Теги">
            <TagList />
        </WindowBox>
        <WindowBox title="Профиль">
            
        </WindowBox>
    </div>
}
