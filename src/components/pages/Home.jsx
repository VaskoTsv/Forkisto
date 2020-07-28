import React from 'react';
import {connectToStore} from '../../store/InitStore.js';
import SearchBar from '../../components/SearchBar.jsx';
import {generateRandomId} from '../../utils.js';
import {API_BASE_URL, NUM_OF_RESULTS} from '../../constants.js';
import RecipeCard from '../../components/RecipeCard.jsx';
import {RecipeCardPlaceholder} from '../../components/RecipeCardPlaceholder.jsx';
import {
    withPagination,
    UpdateStoreFromPaginationHelper
} from '../../components/utils/PaginationUtil.js';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.updateStoreHelper = new UpdateStoreFromPaginationHelper(this, this.props.store);
    }

    componentDidMount() {
        // Fetch recipes using withPagination HOC.
        this.props.onLoadNextPage(this.fetchFromUrl, this.queryParams);
    }

    componentDidUpdate(prevProps) {
        this.updateStoreHelper.updateRecipes(prevProps.paginationData, this.props.paginationData);
    }

    get fetchFromUrl() {
        return API_BASE_URL + 'search';
    }

    get queryParams() {
        const {recipesStore} = this.props.store;

        return {
            query: recipesStore.searchQuery,
            instructionsRequired: true,
            addRecipeInformation: true,
            number: NUM_OF_RESULTS,
            offset: 0,
        }
    }

    fetchRecipes() {
        const {recipesStore} = this.props.store;

        // Clear recipeList from store and from withPagination HOC.
        recipesStore.setRecipes([]);
        this.props.onClearFetchedData();

        // Fetch recipes using withPagination HOC.
        this.props.onLoadNextPage(this.fetchFromUrl, this.queryParams);
    }

    renderSearchBar() {
        return (
            <div className="column is-half-desktop is-offset-one-quarter-desktop is-full-tablet">
                <SearchBar onFetchRecipes={() => this.fetchRecipes()}/>
            </div>
        )
    }

    renderRecipes() {
        const {recipesStore} = this.props.store;

        if (!recipesStore.recipesList.length) {
            return null;
        }

        return recipesStore.recipesList.map(recipe => {
            return (
                <div key={recipe.id}
                     className="column is-one-fifth-desktop is-half-tablet is-full-mobile">
                    <RecipeCard recipe={recipe}/>
                </div>
            );
        });
    }

    renderPlaceholders() {
        const {recipesStore} = this.props.store;

        if (!recipesStore.isLoading) {
            return null;
        }

        const placeholders = Array.from(new Array(NUM_OF_RESULTS / 2));

        return placeholders.map(() => {
            return (
                <div key={generateRandomId()}
                     className="column is-one-fifth-desktop is-half-tablet is-full-mobile">
                    <RecipeCardPlaceholder/>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="container is-fluid">
                <div className="columns">
                    {this.renderSearchBar()}
                </div>
                <div className="columns is-multiline">
                    {this.renderRecipes()}
                    {this.renderPlaceholders()}
                </div>
            </div>
        );
    }
}

export default withPagination(connectToStore(Home));
