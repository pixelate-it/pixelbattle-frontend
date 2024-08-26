import { ComputedProfileStore } from 'src/managers/profile'
import styles from './index.module.css'
import { TagsManager } from 'src/managers/tags'
import { FormattedTag } from 'src/types/api'

interface TagProps {
  tag: FormattedTag
  selectedTag: string
}

export const Tag = ({ tag, selectedTag }: TagProps) => {
  const className = [
    styles.tag,
    tag.name === selectedTag ? styles.selected : ''
  ].join(' ')

  function onClick() {
    if (!ComputedProfileStore.getState().isAuthenticated) {
      return
    }

    TagsManager.selectAndFetch(tag.name)
    // NotificationsManager.addNotification({
    //   type: 'success',
    //   title: 'Изменение тега',
    //   message: `Ваш новый тег: ${tag.name}`
    // })
  }

  return (
    <button className={className} onClick={onClick}>
      <p className={styles.place}>{tag.place + 1}</p>
      <p className={styles.name}>{tag.name}</p>
      <p className={styles.score}>{tag.pixels === -1 ? '??' : tag.pixels}</p>
    </button>
  )
}
