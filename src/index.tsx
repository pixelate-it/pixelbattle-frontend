import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';
import { Suspense } from "preact/compat";

import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Auth/Login';
import { Logout } from './pages/Auth/Logout';

import "./styles/reset.css";
import "./styles/font.css";
import "./styles/index.css";
import styles from "./styles/index.module.css";

export function App() {
	return (
		<LocationProvider>
            <Router>
                <Suspense fallback={
                    <div className={styles.wrapper}>
                        <img
                            className={styles.logo}
                            src={'/images/meta/favicon.svg'}
                            alt={'Логотип Pixel Battle'}
                        />
                        <p className={styles.message}>Loading...</p>
                    </div>
                }>
                    <Route path="/" component={Home}/>
                </Suspense>
                <Route default component={NotFound}/>
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
            </Router>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app') as HTMLElement);
