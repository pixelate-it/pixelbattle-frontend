import { useContext } from "preact/hooks";
import { FormatedTag } from "../../../interfaces/Tag";
import styles from "./Tag.module.css";
import { TagsContext } from "../../../managers/tags";
import { ProfileContext } from "../../../managers/profile";
import { NotificationsManager} from "../../../managers/notifications";

interface TagProps {
    tag: FormatedTag;
}

export function Tag({ tag }: TagProps) {
    const tags = useContext(TagsContext)
    const className = [styles.tag, tag.name === tags.selectedTag.value ? styles.selected : ""].join(" ")
    const profile = useContext(ProfileContext)

    function onClick() {
        if (!profile.isAuthenticated.value) {
            return
        }

        tags.selectAndFetch(tag.name)
        NotificationsManager.addNotification({
            type: "success",
            title: "Смена сторны",
            message: `Теперь вы воюеете за ${tag.name}`
        })
    }

    return (
        <button className={className} onClick={onClick}>
            <p className={styles.place}>{tag.place + 1}</p>
            <p className={styles.name}>{tag.name}</p>
            <p className={styles.score}>{tag.pixels === -1 ? "??" : tag.pixels}</p>
        </button>
    )

}