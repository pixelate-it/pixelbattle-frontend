import { OverlaysDaemon } from 'src/core/daemons/overlays'
import { useDaemon } from '../util/useDaemon'
import { InfoDaemon } from 'src/core/daemons/info'
import { NotificationDaemon } from 'src/core/daemons/notifications'
import { useEffect, useState } from 'preact/hooks'

export const useImageTransform = () => {
  const overlay = useDaemon(OverlaysDaemon)
  const info = useDaemon(InfoDaemon)
  const [fileInput, setFileInput] = useState<HTMLInputElement>()

  useEffect(() => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.oninput = function (event: React.ChangeEvent<HTMLInputElement>) {
      const files = event.currentTarget!.files

      if (files && files.length) {
        uploadImage(files[0])
      }
    }
    setFileInput(fileInput)
  }, [])

  async function uploadImage(image: File) {
    const imageBlob = new Blob([await image.arrayBuffer()])
    const imageBitmap = await createImageBitmap(imageBlob)

    const info = InfoDaemon.getState()

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

    OverlaysDaemon.addImage(imageBlob, image.name, { x: 0, y: 0 })
  }

  function addImage() {
    fileInput?.click()
  }

  function changeCoords(type: 'x' | 'y', value: number) {
    const newPosition = overlay.position!

    newPosition[type] = value

    OverlaysDaemon.setPosition(newPosition)
  }

  function changeOpacity(opacity: string) {
    OverlaysDaemon.setOpacity(parseInt(opacity))
  }

  function unsetImage() {
    OverlaysDaemon.remImage()
  }

  function prevImage() {
    OverlaysDaemon.prevImage()
  }

  function nextImage() {
    OverlaysDaemon.nextImage()
  }

  return {
    changeCoords,
    changeOpacity,
    overlay,
    info,
    unsetImage,
    addImage,
    prevImage,
    nextImage
  }
}
