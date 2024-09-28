export async function blobToString(image: Blob): Promise<string> {
  const reader = new FileReader()

  return new Promise((resolve, reject) => {
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else reject()
    }

    reader.onerror = () => reject()

    reader.readAsDataURL(image)
  })
}

export async function stringToBlob(str: string): Promise<Blob> {
  const fetchResponse = await fetch(str)
  return fetchResponse.blob()
}
