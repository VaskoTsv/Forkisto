import React from 'react';
import classNames from 'classnames';
import {debounce} from '../utils.js';
import {connectToStore} from '../store/InitStore.js';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        const {recipesStore} = this.props.store;

        this.state = {
            searchQuery: recipesStore.searchQuery,
        }

        this.debouncedSearch = debounce();
    }

    handleSearch(e) {
        e.preventDefault();
        const {recipesStore} = this.props.store;

        this.setState({
            searchQuery: e.target.value,
        });

        this.debouncedSearch(() => {
            // Set searchQuery and fetch recipes based on the search.
            recipesStore.setSearchQuery(this.state.searchQuery);
            this.props.onFetchRecipes()
        }, 500);
    }

    clearSearch(e) {
        e.preventDefault();
        const {recipesStore} = this.props.store;

        this.setState({
            searchQuery: '',
        });

        // Clear searchQuery and fetch random recipes.
        recipesStore.setSearchQuery('');
        this.props.onFetchRecipes();
    }

    renderDeleteSearchButton() {
        if (!this.state.searchQuery.length) {
            return null;
        }

        return <a className="delete is-medium" onClick={e => this.clearSearch(e)}/>;
    }

    render() {
        const {recipesStore} = this.props.store;

        return (
            <div className="search-bar field">
                <div
                    className={classNames('control is-medium', {'is-loading': recipesStore.isLoading})}>
                    <input id="searchBar"
                           className="input is-medium"
                           type="text"
                           name="searchQuery"
                           placeholder="Search for a recipe..."
                           autoComplete="off"
                           value={this.state.searchQuery}
                           onChange={e => this.handleSearch(e)}
                    />
                </div>
                {this.renderDeleteSearchButton()}
            </div>
        );
    }
}

export default connectToStore(SearchBar);
