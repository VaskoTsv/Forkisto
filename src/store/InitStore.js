import React from 'react';
import {observable} from 'mobx';
import {observer} from "mobx-react";
import _recipesStore from './RecipesStore.js';
import _quickPeekStore from './QuickPeekStore.js';
import _userStore from './UserStore.js';
import _loaderStore from './LoaderStore.js';

// Export recipeStore to window for debugging.
window.loaderStore = _loaderStore;
window.recipesStore = _recipesStore;
window.quickPeekStore = _quickPeekStore;
window.userStore = _userStore;

// Create new context - StoreContext.
export const StoreContext = React.createContext();

// Create a provider Component - StoreProvider that wraps over the entire App
// to provide access of every component to mobx store.
export class StoreProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = observable({
            loaderStore: _loaderStore,
            recipesStore: _recipesStore,
            quickPeekStore: _quickPeekStore,
            userStore: _userStore,
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
