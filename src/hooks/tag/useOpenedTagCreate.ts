import { useState } from 'preact/hooks'
import { NotificationDaemon } from 'src/core/daemons/notifications'
import { TagsDaemon } from 'src/core/daemons/tags'

export const useOpenedTagCreate = () => {
  const [input, setInput] = useState<string>('')

  function createTag() {
    if (input === '') {
      return
    }

    TagsDaemon.selectAndFetch(input)
    NotificationDaemon.addNotification({
      type: 'success',
      title: 'Изменение тега',
      message: `Ваш новый тег: ${input}`
    })

    TagsDaemon.changeTagCreateOpened(false)
  }

  function closeTagCreate() {
    TagsDaemon.changeTagCreateOpened(false)
  }

  return { createTag, closeTagCreate, setInput }
}
