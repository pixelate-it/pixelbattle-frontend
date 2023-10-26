import { useEffect, useState } from "preact/hooks"
import { ApiTags, FormatedTag } from "../../../interfaces/Tag"
import { config } from "../../../config"
import styles from "./TagWindow.module.css"
import { Tag } from "../Tag"

export function TagList() {
    const [tags, setTags] = useState<FormatedTag[]>([])
    const [tagsInterval, setTagsInterval] = useState<number>()

    function updateTags() {
        fetch("/pixels/get/tag").then(res => res.json()).then((res: ApiTags) => {
            const tags: FormatedTag[] = res.tags.map((tag, index) => ({
                name: tag[0],
                pixels: tag[1],
                place: index
            }))

            setTags(tags)
        })
    }

    useEffect(() => {
        const id = setInterval(updateTags, config.time.update.tags)

        setTagsInterval(id)
    }, [])


    return (
        <div className={styles.tags}>
            {tags.map((tag, index) => <Tag key={index} tag={tag} />)}
        </div>
    )
}