import { useEffect } from 'preact/hooks'
import { Bars } from 'src/components/Bars'
import { Canvas } from 'src/components/Canvas'
import { GeneralDaemon } from 'src/core/daemons/general'

export const Home = () => {
  useEffect(() => {
    GeneralDaemon.run()
  }, [])

  return (
    <>
      <Bars />
      <Canvas />
    </>
  )
}
