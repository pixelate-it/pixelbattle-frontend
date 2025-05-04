import { Button } from 'src/components/General/Button'
import { useClosedTagCreate } from 'src/hooks/tag/useClosedTagCreate'
import styles from './index.module.styl'

export const ClosedTagCreate = () => {
  const { openTagCreate, deleteTag } = useClosedTagCreate()

  return (
    <div className={styles.form}>
      <Button onClick={openTagCreate}>Новый тег</Button>
      <Button onClick={deleteTag} type='danger'>
        Убрать текущий
      </Button>
    </div>
  )
}
