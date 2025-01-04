import { useRef, useState } from 'preact/hooks'
import { InfoDaemon } from 'src/core/daemons/info'
import { NotificationDaemon } from 'src/core/daemons/notifications'
import { OverlaysDaemon } from 'src/core/daemons/overlays'

export const useImageSelect = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  async function uploadImage(image: File) {
    const imageBlob = new Blob([await image.arrayBuffer()])
    const imageBitmap = await createImageBitmap(imageBlob)

    const info = InfoDaemon.state

    const isBiggerThatCanvas =
      info.canvas.width < imageBitmap.width ||
      info.canvas.height < imageBitmap.height

    if (isBiggerThatCanvas) {
      NotificationDaemon.addNotification({
        title: 'Слишком большое изображение',
        message: 'Размер изображения больше игрового поля',
        type: 'error'
      })

      return
    }

    OverlaysDaemon.addOverlay(imageBlob, image.name, { x: 0, y: 0 })
  }

  function onDrop(event: DragEvent) {
    event.preventDefault()

    unhover(event)
    const files = event.dataTransfer?.files

    if (files && files.length) {
      uploadImage(files[0])
    }
  }

  function onInput(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()

    const files = event.currentTarget.files

    if (files && files.length) {
      uploadImage(files[0])
    }
  }

  function hover(event: DragEvent) {
    event.preventDefault()

    setIsHovered(true)
  }

  function unhover(event: DragEvent) {
    event.preventDefault()

    setIsHovered(false)
  }

  return { fileInputRef, isHovered, onDrop, hover, unhover, onInput }
}
