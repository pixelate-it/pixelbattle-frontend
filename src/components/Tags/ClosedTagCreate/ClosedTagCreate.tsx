import { useContext } from "preact/hooks";
import { TagsContext } from "../../../managers/tags";
import { NotificationsManager } from "../../../managers/notifications";
import { ProfileManager } from "../../../managers/profile";
import { Button } from "../../General/Button/Button";
import { isTagCreateOpened } from "../OpenTagSignal";
import styles from "./ClosedTagCreate.module.css";

export function ClosedTagCreate() {
    const tags = useContext(TagsContext)

    function openTagCreate() {
        isTagCreateOpened.value = true
    }

    function deleteTag() {
        if (!ProfileManager.user.value?.tag) {
            return
            // maybe make a message about the impossibility of changing the tag due to its absence?
            // or make the button disabled when the tag is not set
        }

        tags.remove()
        NotificationsManager.addNotification({
            type: "success",
            title: "Отшитие",
            message: "Теперь вы воюете ни за кого"
        });
    }


    return (<div className={styles.form}>
        <Button onClick={openTagCreate}>
            Пришиться
        </Button>
        <Button onClick={deleteTag} type="danger">
            Отшиться
        </Button>
    </div>)
}