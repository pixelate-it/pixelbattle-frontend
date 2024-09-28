import { NotificationDaemon } from 'src/core/daemons/notifications'
import { ProfileDaemon } from 'src/core/daemons/profile'
import { TagsDaemon } from 'src/core/daemons/tags'

export const useClosedTagCreate = () => {
  function openTagCreate() {
    TagsDaemon.changeTagCreateOpened(true)
  }

  function deleteTag() {
    if (!ProfileDaemon.getState().user?.tag) {
      return
    }

    TagsDaemon.remove()
    NotificationDaemon.addNotification({
      type: 'success',
      title: 'Изменение тега',
      message: 'Тег был сброшен'
    })
  }

  return { deleteTag, openTagCreate }
}
