import { useEffect, useState } from "preact/hooks"
import { ApiTags, FormatedTag } from "../../../interfaces/Tag"
import { config } from "../../../config"
import styles from "./TagWindow.module.css"
import { Tag } from "../Tag/Tag"
import { Button } from "../../Button/Button"
import { TextField } from "../../TextField/TextField"

export function TagList() {
    const [tags, setTags] = useState<FormatedTag[]>([])
    const [tagsInterval, setTagsInterval] = useState<number>()
    const [open, setOpen] = useState(false)
    const isLogin = true

    function updateTags() {
        fetch(config.url.api + "/pixels/get/tag")
            .then(res => res.json())
            .then((res: ApiTags) => {
                // const tags: FormatedTag[] = res.tags.map((tag, index) => ({
                //     name: tag[0],
                //     pixels: tag[1],
                //     place: index
                // }))

                const tags: FormatedTag[] = [
                    {
                        name: "Elias",
                        pixels: 100,
                        place: 0
                    },
                    {
                        name: "Test",
                        pixels: 99,
                        place: 1
                    },
                    {
                        name: "Test 2",
                        pixels: 98,
                        place: 2
                    },
                    {
                        name: "Nope",
                        pixels: 87,
                        place: 3
                    },

                ]

                setTags(tags)
            })
    }

    useEffect(() => {
        updateTags()
        const id = setInterval(updateTags, config.time.update.tags)

        setTagsInterval(id)
    }, [])


    return (
        <div className={styles.tags}>
            {tags.map((tag, index) => <Tag key={index} tag={tag} />)}
            {isLogin
                && (open
                    ? (<div className={styles.form}>
                        <TextField placeholder="Новый тег"/>
                        <Button onClick={() => setOpen(true)}>
                            Создать
                        </Button>
                        <Button onClick={() => setOpen(false)}>
                            Отмена
                        </Button>
                    </div>)
                    : (
                        <div>
                        <Button onClick={() => setOpen(true)}>
                            Новый тег
                        </Button>
                        
                    ))
            }

        </div>
    )
}