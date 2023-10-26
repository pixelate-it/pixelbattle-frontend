import { FormatedTag } from "../../../interfaces/Tag";
import styles from "./Tag.module.css";

interface TagProps {
    tag: FormatedTag
}

export function Tag({ tag }: TagProps) {
    return (
        <div className={styles.tag}>
            <p className={styles.place}>{tag.place}</p>
            <p className={styles.name}>{tag.name}</p>
            <p className={styles.score}>{tag.pixels}</p>
        </div>
    )

}