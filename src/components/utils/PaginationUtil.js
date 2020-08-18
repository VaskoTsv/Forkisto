import React from 'react';
import { API_KEY, NUM_OF_RESULTS } from '../../constants.js';
import { fetchData, handleFetchError } from '../../utils.js';

// Create pagination hoc component - adding additional pagination functionality to the wrapped component.
export const withPagination = (Component) => {
    class WithPaginationComponent extends React.Component {
        constructor(props) {
            super(props);

            this.state = this.initialState;

            this.handleScroll = this.handleScroll.bind(this);
        }

        componentDidMount() {
            document.addEventListener("scroll", this.handleScroll);
        }

        componentWillUnmount() {
            document.removeEventListener("scroll", this.handleScroll);
        }

        get initialState() {
            return {
                shouldLoadNextPage: false,
                isLoading: false,
                currentPage: 0,
                hasMore: true,
                fetchedData: [],
                error: false
            };
        }

        get paginationOptions() {
            return {
                number: NUM_OF_RESULTS,
                offset: this.state.currentPage * NUM_OF_RESULTS,
                apiKey: API_KEY,
            }
        }

        handleScroll() {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            const scrolledToLastElement = Boolean(scrollTop + clientHeight > scrollHeight - 80);

            if (scrolledToLastElement && !this.state.isLoading && !this.state.error && this.state.hasMore) {
                this.setState({
                    shouldLoadNextPage: true
                });
            }
        }

        clearFetchedData() {
            this.setState({
                fetchedData: [],
            });
        }

        async loadNextPage(url, options = {}) {
            this.setState({
                isLoading: true,
                currentPage: ++this.state.currentPage
            });

            fetchData(url, { ...options, ...this.paginationOptions }).then(data => {
                if (data.code && data.message) {
                    handleFetchError(data);

                    this.setState({
                        isLoading: false,
                        error: true,
                    });
                    return;
                }

                if (!data.results.length && data.totalResults !== 0) {
                    this.setState({
                        hasMore: false,
                    });
                }

                this.setState({
                    isLoading: false,
                    shouldLoadNextPage: false,
                    error: false,
                    fetchedData: [...this.state.fetchedData, ...data.results],
                });
            });
        }

        render() {
            return (
                <Component {...this.props}
                    paginationData={this.state}
                    onClearFetchedData={() => this.clearFetchedData()}
                    onLoadNextPage={(url, options) => this.loadNextPage(url, options)}
                />
            )
        }
    }

    return WithPaginationComponent;
}

export class UpdateStoreFromPaginationHelper {
    constructor(owner, store) {
        this.owner = owner;
        this.store = store;
    }

    updateRecipes(previousData, currentData) {
        const { recipesStore } = this.store;

        const shouldLoadNextPage = Boolean(
            currentData.shouldLoadNextPage &&
            currentData.shouldLoadNextPage !== previousData.shouldLoadNextPage
        );

        if (shouldLoadNextPage) {
            this.owner.props.onLoadNextPage(this.owner.fetchFromUrl, this.owner.queryParams);
        }

        if (currentData.isLoading !== previousData.isLoading) {
            recipesStore.toggleIsLoading(currentData.isLoading);
        }

        if (this.hasMoreRecipes(previousData, currentData)) {
            recipesStore.setRecipes(currentData.fetchedData);
        }
    }

    hasMoreRecipes(previousData, currentData) {
        return Boolean(currentData.fetchedData.length !== previousData.fetchedData.length);
    }
}
