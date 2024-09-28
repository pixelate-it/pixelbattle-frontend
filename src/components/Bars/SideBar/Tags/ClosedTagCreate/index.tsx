import { Button } from 'src/components/General/Button'
import styles from './index.module.css'
import { useClosedTagCreate } from 'src/hooks/tag/useClosedTagCreate'

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
