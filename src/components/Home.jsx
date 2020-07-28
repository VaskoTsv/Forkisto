import React from 'react';
import {connectToStore} from '../store/InitStore.js';
import {SearchBar} from '../components/layout/SearchBar.jsx';
import {fetchData} from '../utils.js';
import {API_BASE_URL, API_KEY} from '../constants.js';
import {RecipeCard} from '../components/layout/RecipeCard.jsx';
import {observer} from 'mobx-react';

const NUM_OF_RANDOM_RECIPES = 5;

class Home extends React.Component {
    componentDidMount() {
        this.fetchRandomRecipes();
    }

    get queryParams() {
        return {
            numberQuery: `?number=${NUM_OF_RANDOM_RECIPES}`,
            apiKey: `&apiKey=${API_KEY}`,
        }
    }

    fetchRandomRecipes() {
        const {recipesStore} = this.props.store;

        if (!recipesStore) {
            return;
        }

        recipesStore.toggleIsLoading(true);

        fetchData(API_BASE_URL + 'random', this.queryParams).then(data => {
            if (!data.recipes) {
                // Show error message
                return;
            }
            recipesStore.setRandomRecipes(data.recipes);
            recipesStore.toggleIsLoading(false);
        });
    }

    renderSearchBar() {
        return (
            <div className="column is-half-desktop is-offset-one-quarter-desktop is-full-tablet">
                <SearchBar/>
            </div>
        )
    }

    renderRecipe(recipe) {
        return (
            <div className="column is-one-quarter-desktop is-half-tablet is-full-mobile">
                <RecipeCard recipe={recipe}/>
            </div>
        )
    }

    renderLoadedRecipes() {
        const {recipesStore} = this.props.store;

        console.log('render loaded recipes', recipesStore.recipesList, recipesStore.isLoading, recipesStore.recipesList.length);

        if (!recipesStore.recipesList.length) {
            return null;
        }

        return recipesStore.recipesList.map(recipe => this.renderRecipe(recipe));
    }

    render() {
        return (
            <div className="container is-fluid">
                <div className="columns">
                    {this.renderSearchBar()}
                </div>
                <div className="columns">
                    {this.renderLoadedRecipes()}
                </div>
            </div>
        );
    }
}

export default connectToStore(Home);
