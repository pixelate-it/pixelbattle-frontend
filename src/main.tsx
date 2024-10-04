import { render } from 'preact'
import './styles/reset.css'
import './styles/index.css'
import './styles/font.css'
import { Home } from './pages/home'

const App = () => {
  return (
    <>
      <Home />
    </>
  )
}

render(<App />, document.getElementById('app')!)
