import { OverlaysDaemon } from 'src/core/daemons/overlays'
import { useDaemon } from '../util/useDaemon'
import { InfoDaemon } from 'src/core/daemons/info'
import { NotificationDaemon } from 'src/core/daemons/notifications'
import { useEffect, useState } from 'preact/hooks'

export const useImageTransform = () => {
  const overlay = useDaemon(OverlaysDaemon)
  const info = useDaemon(InfoDaemon)
  const [fileInput, setFileInput] = useState<HTMLInputElement>()
  const [reuploadInput, setReuploadInput] = useState<HTMLInputElement>()

  useEffect(() => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.oninput = (event: Event) => {
      const files = (event.currentTarget! as HTMLInputElement).files
      if (files && files.length) {
        uploadImage(files[0], false)
      }
    }
    setFileInput(fileInput)
    const fileInput2 = document.createElement('input')
    fileInput2.type = 'file'
    fileInput2.accept = 'image/*'
    fileInput2.oninput = (event: Event) => {
      const files = (event.currentTarget! as HTMLInputElement).files
      if (files && files.length) {
        uploadImage(files[0], true)
      }
    }
    setReuploadInput(fileInput2)
  }, [])

  async function uploadImage(image: File, sets: boolean) {
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

    sets
      ? OverlaysDaemon.setImage(imageBlob, image.name)
      : OverlaysDaemon.addImage(imageBlob, image.name, { x: 0, y: 0 })
  }

  function reuploadImage() {
    reuploadInput?.click()
  }

  function addImage() {
    fileInput?.click()
  }

  function changeCoords(type: 'x' | 'y', value: number) {
    const newPosition = {
      x: OverlaysDaemon.image!.x,
      y: OverlaysDaemon.image!.y
    }

    newPosition[type] = value

    OverlaysDaemon.setPosition(newPosition.x, newPosition.y)
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
    nextImage,
    reuploadImage
  }
}
