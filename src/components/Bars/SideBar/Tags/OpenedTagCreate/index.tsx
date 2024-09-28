import styles from './index.module.css'
import { Button } from 'src/components/General/Button'
import { Icon } from 'src/components/General/Icon'
import { TextField } from 'src/components/General/TextFIeld'
import { useOpenedTagCreate } from 'src/hooks/tag/useOpenedTagCreate'

export const OpenedTagCreate = () => {
  const { createTag, setInput, closeTagCreate } = useOpenedTagCreate()

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
