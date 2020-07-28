import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {StoreProvider} from '../store/InitStore.js';
import "bulma";
import Home from '../components/Home.jsx';
import {Navigation} from '../components/layout/Navigation.jsx';
import {Footer} from '../components/layout/Footer.jsx';

export class App extends React.PureComponent {
    render() {
        return (
            <StoreProvider>
                <Navigation/>

                <BrowserRouter>
                    <Switch>
                        <Route
                            exact
                            path=""
                            component={Home}
                        />
                    </Switch>
                </BrowserRouter>

                <Footer/>
            </StoreProvider>
        );
    }
}
