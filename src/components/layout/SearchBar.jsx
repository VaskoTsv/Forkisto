import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import {API_KEY, API_BASE_URL, NUM_OF_RESULTS} from '../../constants.js';
import {debounce, fetchData} from '../../utils.js';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchQuery: '',
        }

        this.debouncedSearch = debounce();
    }

    get queryParams() {
        return {
            searchQuery: '?query=' + this.state.searchQuery,
            numberOfResults: '&number=' + NUM_OF_RESULTS,
            numberOfSkippedResults: '&offset=' + 0,
            apiKey: `&apiKey=${API_KEY}`,
        };
    }

    handleSearch(e) {
        e.preventDefault();

        this.setState({searchQuery: e.target.value});

        this.debouncedSearch(() => {
            this.setState({isLoading: true});
            fetchData(API_BASE_URL + 'search', this.queryParams).then(data => {
                console.log('response', data);
                this.setState({isLoading: false});
            });
        }, 280);
    }

    render() {
        return (
            <div className="search-bar field">
                <div
                    className={classNames('control is-medium', {'is-loading': this.state.isLoading})}>
                    <input id="searchBar"
                           className="input is-medium"
                           type="text"
                           name="searchQuery"
                           placeholder="Search for a recipe..."
                           value={this.state.searchQuery}
                           onChange={e => this.handleSearch(e)}
                    />
                </div>
            </div>
        );
    }
}

export default observer(SearchBar);
