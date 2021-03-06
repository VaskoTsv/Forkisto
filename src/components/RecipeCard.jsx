import React from 'react';
import { shortenText, removeHtmlFromText, fetchData } from '../utils.js';
import { API_BASE_URL, API_KEY, IMAGE_BASE_URL } from '../constants.js';
import { connectToStore } from '../store/InitStore.js';
import LikeRecipe from './LikeRecipe.jsx';

export class RecipeCard extends React.Component {
    get fetchFromUrl() {
        return `${API_BASE_URL}${this.props.recipe.id}/information`;
    }

    get queryParams() {
        return {
            apiKey: API_KEY,
        }
    }

    getImage(recipe) {
        if (recipe.image.includes(IMAGE_BASE_URL)) {
            return recipe.image;
        }

        return IMAGE_BASE_URL + recipe.image;
    }

    fetchRecipeDetails(e) {
        e.preventDefault();
        const {recipesStore, quickPeekStore, loaderStore} = this.props.store;

        loaderStore.startLoader();
        fetchData(this.fetchFromUrl, this.queryParams).then(data => {
            recipesStore.setRecipeDetails(data);
            quickPeekStore.openModal();
            loaderStore.stopLoader();
        }).catch(e => {
            alert(e.message);
            loaderStore.stopLoader();
        });
    }

    render() {
        const {recipe} = this.props;

        return (
            <div className="card">
                <div className="card-image" onClick={e => this.fetchRecipeDetails(e)}>
                    <figure className="image is-4by3">
                        <img src={this.getImage(recipe)} alt={recipe.title} />
                    </figure>
                </div>
                <LikeRecipe recipeId={recipe.id} />
                <div className="card-content" onClick={e => this.fetchRecipeDetails(e)}>
                    <div className="media">
                        <div className="media-content">
                            <p className="title is-4">{recipe.title}</p>
                            <p className="subtitle is-6">Cooking
                                Time: {recipe.readyInMinutes}</p>
                        </div>
                    </div>

                    {recipe.summary ?
                        <div className="content">
                            {shortenText(removeHtmlFromText(recipe.summary), 180)}
                        </div> : null
                    }
                </div>
            </div>
        );
    }
}

export default connectToStore(RecipeCard);
