import { render } from 'preact'
import './styles/reset.css'
import './styles/index.styl'
import './styles/font.styl'
import { Home } from './pages/home'

const App = () => {
  return (
    <>
      <Home />
    </>
  )
}

render(<App />, document.getElementById('app')!)
