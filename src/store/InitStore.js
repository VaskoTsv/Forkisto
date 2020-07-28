import React from 'react';
import _recipesStore from './RecipesStore.js';
import {observer} from "mobx-react";
import {observable} from 'mobx';

window.recipesStore = _recipesStore;

// Create new context - StoreContext
export const StoreContext = React.createContext();

// Create a provider Component - StoreProvider
export class StoreProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = observable({
            recipesStore: _recipesStore,
        })
    }

    render() {
        return (
            <StoreContext.Provider value={this.state}>
                {this.props.children}
            </StoreContext.Provider>
        )
    }
}

// Create connectToStore hoc function - returning ConnectedComponent wrapping over passed Component
// thus providing access to the later to mobx store via props.
export const connectToStore = Component => {
    const ObservableComponent = observer(Component);

    class ConnectedComponent extends React.Component {
        render() {
            return (
                <StoreContext.Consumer>
                    {store => <ObservableComponent store={store}/>}
                </StoreContext.Consumer>
            )
        }
    }

    return ConnectedComponent;
}
