import { FormattedTag } from 'src/core/classes/api/types'
import styles from './index.module.css'
import { useTag } from 'src/hooks/tag/useTag'

interface TagProps {
  tag: FormattedTag
  selectedTag: string
}

export const Tag = ({ tag, selectedTag }: TagProps) => {
  const className = [
    styles.tag,
    tag.name === selectedTag ? styles.selected : ''
  ].join(' ')

  const { onClick } = useTag(tag)

  return (
    <button className={className} onClick={onClick}>
      <p className={styles.place}>{tag.place + 1}</p>
      <p className={styles.name}>{tag.name}</p>
      <p className={styles.score}>{tag.pixels === -1 ? '??' : tag.pixels}</p>
    </button>
  )
}
