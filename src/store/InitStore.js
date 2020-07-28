import React from 'react';
import {observable} from 'mobx';
import {observer} from "mobx-react";
import _recipesStore from './RecipesStore.js';
import _quickPeekStore from './QuickPeekStore.js';

// Export recipeStore to window for debugging.
window.recipesStore = _recipesStore;
window.quickPeekStore = _quickPeekStore;

// Create new context - StoreContext.
export const StoreContext = React.createContext();

// Create a provider Component - StoreProvider that wraps over the entire App
// to provide access of every component to mobx store.
export class StoreProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = observable({
            recipesStore: _recipesStore,
            quickPeekStore: _quickPeekStore,
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

// Create connectToStore hoc function - thus providing access for the
// passed component to mobx store via props.
export const connectToStore = Component => {
    const ObservableComponent = observer(Component);

    class ConnectedComponent extends React.Component {
        render() {
            return (
                <StoreContext.Consumer>
                    {store => <ObservableComponent {...this.props} store={store}/>}
                </StoreContext.Consumer>
            )
        }
    }

    return ConnectedComponent;
}
