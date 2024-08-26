import { Button } from 'src/components/General/Button'
import styles from './index.module.css'
import { TagsManager, TagsStore } from 'src/managers/tags'
import { ProfileStore } from 'src/managers/profile'
import { NotificationsManager } from 'src/managers/notifications'

export const ClosedTagCreate = () => {
  function openTagCreate() {
    TagsStore.setState({ isTagCreateOpened: true })
  }

  function deleteTag() {
    if (!ProfileStore.getState().user?.tag) {
      return
    }

    TagsManager.remove()
    NotificationsManager.addNotification({
      type: 'success',
      title: 'Изменение тега',
      message: 'Тег был сброшен'
    })
  }

  return (
    <div className={styles.form}>
      <Button onClick={openTagCreate}>Новый тег</Button>
      <Button onClick={deleteTag} type='danger'>
        Убрать текущий
      </Button>
    </div>
  )
}
