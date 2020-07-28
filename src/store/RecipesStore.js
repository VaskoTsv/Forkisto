import {observable, action} from 'mobx';

export class RecipesStore {
    @observable
    recipesList = [];
    @observable
    isLoading = false;

    @action
    toggleIsLoading(isLoading) {
        this.isLoading = isLoading;
    }

    @action
    setRandomRecipes(recipes) {
        this.recipesList = recipes;
    }

    @action
    appendRecipes(recipes) {
        this.recipesList = this.recipesList.concat(recipes);
    }
}

const _recipesStore = new RecipesStore();
export default _recipesStore;
