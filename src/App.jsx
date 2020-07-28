import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {StoreProvider} from './store/InitStore.js';
import "bulma";
import Home from './components/pages/Home.jsx';
import {About} from './components/pages/About.jsx';
import {Navigation} from './components/Navigation.jsx';
import {Footer} from './components/Footer.jsx';
import {ScrollToTopButton} from './components/ScrollToTopButton.jsx';
import QuickPeek from './components/QuickPeek.jsx';

export class App extends React.PureComponent {
    render() {
        return (
            <StoreProvider>
                <BrowserRouter>
                    <Navigation/>

                    <div className="main-container">
                        <Switch>
                            <Route
                                exact
                                path="/"
                                component={Home}
                            />
                            <Route
                                exact
                                path="/about"
                                component={About}
                            />
                        </Switch>
                    </div>

                    <Footer/>
                    <ScrollToTopButton/>
                    <QuickPeek/>
                </BrowserRouter>
            </StoreProvider>
        );
    }
}
