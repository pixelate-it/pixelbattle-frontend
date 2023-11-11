import { useContext, useEffect, useState } from "preact/hooks"
import { config } from "../../../config"
import styles from "./Tags.module.css"
import { Tag } from "../Tag/Tag"
import { Button } from "../../Button/Button"
import { TextField } from "../../TextField/TextField"
import { WindowBox } from "../../WindowBox/WindowBox"
import { TagsContext } from "../../../managers/tags"
import { ProfileContext } from "../../../managers/profile"
import { signal } from "@preact/signals"
import { OpenedTagCreate } from "../OpenedTagCreate/OpenedTagCreate"
import { ClosedTagCreate } from "../ClosedTagCreate/ClosedTagCreate"
import { isTagCreateOpened } from "../OpenTagSignal"
import { InfoContext } from "../../../managers/info"





export function Tags() {
    const [tagsInterval, setTagsInterval] = useState<NodeJS.Timeout>()
    const tags = useContext(TagsContext)
    const profile = useContext(ProfileContext)
    const info = useContext(InfoContext)


    useEffect(() => {
        tags.fetch()
        const id = setInterval(tags.fetch, config.time.update.tags)

        setTagsInterval(id)
    }, [])



    return (
        <WindowBox title="Теги">
            <div className={styles.tags}>
                {
                    tags.tags.value.length === 0
                        ? <p className={styles.empty}>Нет тегов</p>
                        : tags.tags.value.map((tag, index) =>
                            <Tag
                                key={tag.name}
                                tag={tag} />)
                }
                {
                    (profile.isAuthenticated.value)
                        ? isTagCreateOpened.value
                            ? <OpenedTagCreate />
                            : <ClosedTagCreate />
                        : null
                }

            </div>
        </WindowBox >
    )
}