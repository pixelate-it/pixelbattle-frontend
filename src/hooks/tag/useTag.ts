import { FormattedTag } from 'src/core/classes/api/types'
import { NotificationDaemon } from 'src/core/daemons/notifications'
import { ProfileDaemon } from 'src/core/daemons/profile'
import { TagsDaemon } from 'src/core/daemons/tags'

export const useTag = (tag: FormattedTag) => {
  function onClick() {
    if (!ProfileDaemon.state.isAuthenticated) {
      NotificationDaemon.addNotification({
        type: 'error',
        title: 'Необходимо авторизоваться',
        message: `Вы не вошли в аккаунт`
      })
      return
    }

    TagsDaemon.selectAndFetch(tag.name)
    NotificationDaemon.addNotification({
      type: 'success',
      title: 'Изменение тега',
      message: `Ваш новый тег: ${tag.name}`
    })
  }

  return { onClick }
}
