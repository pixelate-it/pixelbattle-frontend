import { useState } from 'preact/hooks'
import { TagsManager, TagsStore } from 'src/managers/tags'
import styles from './index.module.css'
import { Button } from 'src/components/General/Button'
import { Icon } from 'src/components/General/Icon'
import { TextField } from 'src/components/General/TextFIeld'
import { NotificationsManager } from 'src/managers/notifications'

export const OpenedTagCreate = () => {
  const [input, setInput] = useState<string>('')

  function createTag() {
    if (input === '') {
      return
    }

    TagsManager.selectAndFetch(input)
    NotificationsManager.addNotification({
      type: 'success',
      title: 'Изменение тега',
      message: `Ваш новый тег: ${input}`
    })

    TagsStore.setState({ isTagCreateOpened: false })
  }

  function closeTagCreate() {
    TagsStore.setState({ isTagCreateOpened: false })
  }

  return (
    <div className={styles.form}>
      <TextField placeholder='Новый тег' onInput={setInput} min={4} max={8} />
      <Button onClick={createTag}>
        <Icon icon='plus' />
      </Button>
      <Button onClick={closeTagCreate} type='danger'>
        <Icon icon='plus' className={styles.closeIcon} />
      </Button>
    </div>
  )
}
