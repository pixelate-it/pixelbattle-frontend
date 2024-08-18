import BottomBar from 'src/components/BottomBar'
import { Canvas } from 'src/components/Canvas'
import { BottomBarStore } from 'src/stores/bottombar'
import { Provider } from 'unistore/preact'

export const Home = () => {
  return (
    <>
      <Provider store={BottomBarStore}>
        <BottomBar></BottomBar>
      </Provider>
      <Canvas />
    </>
  )
}
