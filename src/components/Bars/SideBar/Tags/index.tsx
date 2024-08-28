import { useEffect } from 'preact/hooks'
import { AppConfig } from 'src/classes/AppConfig'
import { WindowBox } from 'src/components/General/WindowBox'
import { useStore } from 'src/hooks/useStore'
import { ComputedProfileStore } from 'src/managers/profile'
import { TagsManager, TagsStore } from 'src/managers/tags'
import styles from './index.module.css'
import { Tag } from './Tag'
import { ClosedTagCreate } from './ClosedTagCreate'
import { OpenedTagCreate } from './OpenedTagCreate'

export const Tags = () => {
  const profile = useStore(ComputedProfileStore)
  const tags = useStore(TagsStore)

  useEffect(() => {
    const id = setInterval(TagsManager.fetch, AppConfig.time.update.tags)

    return () => {
      clearInterval(id)
    }
  }, [])

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
