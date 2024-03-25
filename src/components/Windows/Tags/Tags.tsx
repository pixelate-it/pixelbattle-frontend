import { useContext, useEffect, useState } from "preact/hooks";
import { config } from "../../../config";
import styles from "./Tags.module.css";
import { Tag } from "../../Tags/Tag/Tag";
import { WindowBox } from "../../WindowBox/WindowBox";
import { TagsContext } from "../../../managers/tags";
import { ProfileContext } from "../../../managers/profile";
import { OpenedTagCreate } from "../../Tags/OpenedTagCreate/OpenedTagCreate";
import { ClosedTagCreate } from "../../Tags/ClosedTagCreate/ClosedTagCreate";
import { isTagCreateOpened } from "../../Tags/OpenTagSignal";





export function Tags() {
    const [tagsInterval, setTagsInterval] = useState<NodeJS.Timeout>()
    const tags = useContext(TagsContext)
    const profile = useContext(ProfileContext)


    useEffect(() => {
        tags.fetch()
        const id = setInterval(tags.fetch, config.time.update.tags)

        setTagsInterval(id)
    }, [])



    return (
        <WindowBox title="Группировки">
            <div className={styles.tags}>
                {
                    tags.tags.value.length === 0
                        ? <p className={styles.empty}>Даже перекати-поля нет...</p>
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