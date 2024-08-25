import { useEffect } from 'preact/hooks'
import { Bars } from 'src/components/Bars'
import { Canvas } from 'src/components/Canvas'
import { GeneralManager } from 'src/managers/general'

export const Home = () => {
  useEffect(() => {
    GeneralManager.loadAll()
  }, [])

  return (
    <>
      <Bars />
      <Canvas />
    </>
  )
}
