import { useContext, useState } from "preact/hooks"
import { TagsContext } from "../../../managers/tags"
import { Button } from "../../Button/Button"
import { TextField } from "../../TextField/TextField"
import { isTagCreateOpened } from "../OpenTagSignal"
import styles from "./OpenedTagCreate.module.css"

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
        tags.select(input)
        isTagCreateOpened.value = false
    }

    function closeTagCreate() {
        isTagCreateOpened.value = false
    }

    return (<div className={styles.form}>
        <TextField placeholder="Новый тег" onInput={handleInput} min={4} max={8}/>
        <Button onClick={createTag}>
            <img src="/images/icons/plus.svg" />
        </Button>
        <Button onClick={closeTagCreate} type="danger">
            <img src="/images/icons/plus.svg" style={{ transform: "rotate(45deg)" }} />
        </Button>
    </div>)
}
