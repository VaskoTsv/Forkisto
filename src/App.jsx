import "bulma";
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Footer } from './components/Footer.jsx';
import Navigation from './components/Navigation.jsx';
import { About } from './components/pages/About.jsx';
import Authentication from './components/pages/Authentication.jsx';
import Home from './components/pages/Home.jsx';
import Lists from './components/pages/Lists.jsx';
import QuickPeek from './components/QuickPeek.jsx';
import { ScrollToTopButton } from './components/ScrollToTopButton.jsx';
import { StoreProvider } from './store/InitStore.js';
import Loader  from './components/Loader.jsx';

export class App extends React.PureComponent {
    render() {
        return (
            <StoreProvider>
                <BrowserRouter>
                    <Navigation />

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
                            <Route
                                exact
                                path="/lists"
                                component={Lists}
                            />
                            <Route
                                exact
                                path="/auth"
                                component={Authentication}
                            />
                        </Switch>
                    </div>

                    <Footer />
                    <Loader />
                    <ScrollToTopButton />
                    <QuickPeek />
                </BrowserRouter>
            </StoreProvider>
        );
    }
}
