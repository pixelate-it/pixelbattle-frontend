import { render } from 'preact'
import './styles/font.css'
import './styles/index.css'
import { Canvas } from './components/Canvas'

const App = () => {
  return <Canvas />
}

render(<App />, document.getElementById('app')!)
