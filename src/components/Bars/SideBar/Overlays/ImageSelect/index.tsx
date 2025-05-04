import { useImageSelect } from 'src/hooks/overlay/useImageSelect'
import { Button } from 'src/components/General/Button'
import styles from './index.module.styl'

export const ImageSelect = () => {
  const { isHovered, onDrop, hover, unhover, onInput, fileInputRef } =
    useImageSelect()

  return (
    <div
      class={[styles.wrapper, isHovered ? styles.wrapperActive : ''].join(' ')}
      onDrop={onDrop}
      onDragEnter={hover}
      onDragOver={hover}
      onDragLeave={unhover}
    >
      <p class={styles.label}>Перетащите изображение</p>

      <p class={styles.or}>или</p>

      <input
        type='file'
        accept='image/*'
        onInput={onInput}
        ref={fileInputRef}
        class={styles.input}
      />

      <Button onClick={() => fileInputRef.current?.click()}>
        Выберите файл
      </Button>
    </div>
  )
}
