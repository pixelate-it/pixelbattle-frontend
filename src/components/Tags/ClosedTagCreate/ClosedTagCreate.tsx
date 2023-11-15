import { useContext } from "preact/hooks"
import { TagsContext } from "../../../managers/tags"
import { Button } from "../../General/Button/Button"
import { isTagCreateOpened } from "../OpenTagSignal"
import styles from "./ClosedTagCreate.module.css"

export function ClosedTagCreate() {
    const tags = useContext(TagsContext)

    function openTagCreate() {
        isTagCreateOpened.value = true
    }

    function deleteTag() {
        tags.remove()
    }


    return (<div className={styles.form}>
        <Button onClick={openTagCreate}>
            Новый тег
        </Button>
        <Button onClick={deleteTag} type="danger">
            Убрать текущий
        </Button>
    </div>)
}