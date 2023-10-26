import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

import "./styles/reset.css";
import "./styles/font.css";
import "./styles/index.css";

export function App() {
	return (
		<LocationProvider>
            <Router>
                <Route path="/" component={Home} />
                <Route default component={NotFound} />
            </Router>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
