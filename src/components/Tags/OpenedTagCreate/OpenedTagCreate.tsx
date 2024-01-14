import { useContext, useState } from "preact/hooks"
import { TagsContext } from "../../../managers/tags"
import { Button } from "../../General/Button/Button"
import { TextField } from "../../General/TextField/TextField"
import { isTagCreateOpened } from "../OpenTagSignal"
import styles from "./OpenedTagCreate.module.css"
import { Icon } from "../../General/Icon/Icon"

export function OpenedTagCreate() {
    const tags = useContext(TagsContext)
    const [input, setInput] = useState<string>("")

    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement
        const value = input.value

        setInput(value)
    }

    function createTag() {
        if (input === "") {
            return
        }
        tags.selectAndFetch(input)
        isTagCreateOpened.value = false
    }

    function closeTagCreate() {
        isTagCreateOpened.value = false
    }

    return (<div className={styles.form}>
        <TextField placeholder="Новый тег" onInput={handleInput} min={4} max={8}/>
        <Button onClick={createTag}>
            <Icon icon="plus" />
        </Button>
        <Button onClick={closeTagCreate} type="danger">
            <Icon icon="plus" className={styles.closeIcon}/>
        </Button>
    </div>)
}
