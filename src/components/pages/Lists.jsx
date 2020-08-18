import React from 'react';
import { connectToStore } from '../../store/InitStore.js';
import classNames from 'classnames';
import { API_BASE_URL, API_KEY, STRAPI_BASE_PROD } from '../../constants.js';
import { deleteData, fetchData } from '../../utils.js';
import RecipeCard from '../RecipeCard.jsx';
import CreateNewList from '../CreateNewList.jsx';

export class Lists extends React.Component {
    constructor(props) {
        super(props);

        this.isFetchingRecipes = false;

        this.state = {
            activeListId: this.getActiveListId(),
        }
    }

    async componentDidMount() {
        // If there is no active list, there are no recipes to be fetched.
        if (!this.getActiveListId()) {
            return;
        }

        // Get the current active list recipes and save them in recipesStore.
        const recipes = await this.getListRecipes();
        this.props.store.recipesStore.setRecipes(recipes);
    }

    async componentDidUpdate(prevProps, prevState) {
        // If there is no active list, there are no recipes to be fetched.
        if (!this.getActiveListId()) {
            return;
        }

        // When lists tab is changed, get the current active list recipes and save them in recipesStore.
        if (this.state.activeListId !== prevState.activeListId) {
            const recipes = await this.getListRecipes();
            this.props.store.recipesStore.setRecipes(recipes);
        }
    }

    componentWillUnmount() {
        this.props.store.recipesStore.setRecipes([]);
    }

    getRecipeInfoUrl(recipeId) {
        return `${API_BASE_URL}${recipeId}/information`;
    }

    get queryParams() {
        return {apiKey: API_KEY};
    }

    getActiveListId() {
        // Return activeListId to be the first one from the user's lists,
        // if the user has no lists, return null for activeListId.
        const {userStore} = this.props.store;

        if (!userStore.lists.length) {
            return null;
        }

        return userStore.lists[0].id;
    }

    handleTabChange(e, listId) {
        e.preventDefault();

        if (this.isFetchingRecipes) {
            return;
        }

        this.setState({activeListId: listId});
        this.isFetchingRecipes = true;
    }

    handleDeleteList() {
        const {userStore, loaderStore} = this.props.store;
        const listName = userStore.lists.find(list => list.id === this.state.activeListId).name;

        const confirmDeleteDialog = confirm(`Are you sure you want to delete the "${listName}" list?`);

        if (!confirmDeleteDialog) {
            return;
        }

        loaderStore.startLoader();
        deleteData(`${STRAPI_BASE_PROD}lists/${this.state.activeListId}`).then(data => {
            if (!data.id) {
                alert('Error on deleting list!');
                return;
            }

            userStore.removeFromLists(data);
            this.setState({activeListId: this.getActiveListId});
            loaderStore.stopLoader();
        }).catch(e => {
            alert(e.message);
            loaderStore.stopLoader();
        });
    }

    async getListRecipes() {
        let recipes = [];

        const {userStore, loaderStore} = this.props.store;
        const activeList = userStore.lists.filter(list => list.id === this.state.activeListId)[0];

        loaderStore.startLoader();
        try {
            recipes = await this.fetchListRecipes(activeList.recipes);
        } catch (e) {
            alert('There was an error with getting the recipes data!');
        } finally {
            loaderStore.stopLoader();
        }

        return recipes;
    }

    async fetchListRecipes(recipesIds) {
        let recipes = [];
        let promises = [];

        recipesIds.forEach(id => {
            const promise = new Promise((resolve, reject) => {
                fetchData(this.getRecipeInfoUrl(id), this.queryParams).then(data => {
                    if (data.code && data.message) {
                        reject(data);
                        return;
                    }

                    resolve(data);
                });
            });

            promises.push(promise);
        })

        recipes = await Promise.all(promises);
        this.isFetchingRecipes = false;

        return recipes;
    }

    renderListsTabs() {
        const {userStore} = this.props.store;

        if (!userStore.lists.length) {
            return null;
        }

        return (
            <div className="tabs">
                <ul>{userStore.lists.map(list => this.renderList(list))}</ul>
            </div>
        );
    }

    renderList(list) {
        return (
            <li key={list.id}
                className={classNames({'is-active': this.state.activeListId === list.id})}
                onClick={e => this.handleTabChange(e, list.id)}>
                <a>{list.name}</a>
            </li>
        );
    }

    renderNoListsMessage() {
        const {userStore} = this.props.store;

        if (userStore.lists.length) {
            return null;
        }

        return (
            <div>
                <h4 className="subtitle">You don't have any favourite lists...</h4>
            </div>
        );
    }

    renderListContent() {
        const {userStore, recipesStore} = this.props.store;

        if (!userStore.lists.length || !recipesStore.recipesList.length) {
            return null;
        }

        return recipesStore.recipesList.map(recipe => {
            return (
                <div key={recipe.id}
                     className="column is-one-fifth-desktop is-half-tablet is-full-mobile">
                    <RecipeCard recipe={recipe} />
                </div>
            );
        });
    }

    render() {
        return (
            <div className="container is-fluid mt-5">
                <div className="columns is-right is-vcentered">
                    <div className="column is-two-fifths">
                        <CreateNewList />
                    </div>
                    <div className="column">
                        {userStore.lists.length ?
                            <button className="button is-danger"
                                    onClick={() => this.handleDeleteList()}>
                                Delete List
                            </button> : null}
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-full">
                        {this.renderNoListsMessage()}
                        {this.renderListsTabs()}
                    </div>
                </div>
                <div className="columns is-multiline">
                    {this.renderListContent()}
                </div>
            </div>
        );
    }
}

export default connectToStore(Lists);
