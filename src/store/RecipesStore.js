import {observable, action} from 'mobx';
import _ from 'lodash';

export class RecipesStore {
    @observable
    isLoading = false;
    @observable
    searchQuery = '';
    @observable
    recipesList = [];
    @observable
    recipeDetails = null;

    @action
    toggleIsLoading(isLoading) {
        this.isLoading = isLoading;
    }

    @action
    setSearchQuery(query) {
        this.searchQuery = query;
    }

    @action
    setRecipes(recipes) {
        this.recipesList = recipes;
    }

    @action
    appendRecipes(recipes) {
        this.recipesList = _.uniqBy(this.recipesList.concat(recipes), 'id');
    }

    @action
    setRecipeDetails(recipe) {
        this.recipeDetails = recipe;
    }
}

const _recipesStore = new RecipesStore();
export default _recipesStore;
