import { WindowBox } from 'src/components/General/WindowBox'
import { Tag } from './Tag'
import { ClosedTagCreate } from './ClosedTagCreate'
import { OpenedTagCreate } from './OpenedTagCreate'
import { useTags } from 'src/hooks/tag/useTags'
import styles from './index.module.styl'

export const Tags = () => {
  const { tags, profile } = useTags()

  return (
    <WindowBox title='Теги'>
      <div className={styles.tags}>
        {tags.loaded ? (
          <>
            {tags.tags.length === 0 ? (
              <p className={styles.empty}>Нет тегов</p>
            ) : (
              tags.tags.map((tag) => (
                <Tag key={tag.name} tag={tag} selectedTag={tags.selectedTag} />
              ))
            )}
            {profile.isAuthenticated ? (
              tags.isTagCreateOpened ? (
                <OpenedTagCreate />
              ) : (
                <ClosedTagCreate />
              )
            ) : null}
          </>
        ) : (
          <>
            {/* Mirdukkkkk please make styles for this! */}
            <p>Загрузка тегов...</p>
          </>
        )}
      </div>
    </WindowBox>
  )
}
