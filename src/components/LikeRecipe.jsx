import classNames from 'classnames';
import React from 'react';
import { STRAPI_BASE_PROD } from '../constants.js';
import { connectToStore } from '../store/InitStore.js';
import { putData } from '../utils.js';
import CreateNewList from './CreateNewList.jsx';

export class LikeRecipe extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAddToListOpen: false,
        }
    }

    isLikedRecipe() {
        const {userStore} = this.props.store;
        let isLiked = false;

        if (!userStore.lists.length) {
            return isLiked;
        }

        for (const list of userStore.lists) {
            if (!list.recipes.length) {
                continue;
            }

            if (list.recipes.includes(this.props.recipeId)) {
                isLiked = true;
                break;
            }
        }

        return isLiked;
    }

    toggleAddToListContainer(e, isOpen) {
        e.stopPropagation();
        this.setState({isAddToListOpen: isOpen});
    }

    handleUpdateListRecipes(list, isRecipeAlreadyInList) {
        let recipes = [...list.recipes];

        // Remove recipe from list
        if (isRecipeAlreadyInList) {
            const filteredRecipes = recipes.filter(recipeId => recipeId !== this.props.recipeId);
            this.updateList(list, filteredRecipes);
            return;
        }

        // Add recipe to list
        recipes.push(this.props.recipeId);
        this.updateList(list, recipes);
    }

    updateList(list, recipes) {
        const {userStore, loaderStore} = this.props.store;

        loaderStore.startLoader();
        putData(`${STRAPI_BASE_PROD}lists/${list.id}`, {recipes: recipes}).then(data => {
            const updatedList = {...data, user: data.user.id};
            userStore.updateList(updatedList);

            this.setState({isAddToListOpen: false});
            loaderStore.stopLoader();
        }).catch(e => {
            alert(e.message);
            loaderStore.stopLoader();
        });
    }

    renderAddToListModal() {
        const {userStore} = this.props.store;

        return (
            <div className={classNames('modal', {'is-active': this.state.isAddToListOpen})}>
                <div className="modal-background"
                     onClick={e => this.toggleAddToListContainer(e, false)} />
                <div className="modal-content">
                    <div className="add-to-list-container">
                        <div className="lists-content">
                            {userStore.lists.map(list => this.renderList(list))}
                        </div>
                        <CreateNewList />
                    </div>
                </div>
                <button className="modal-close is-large" aria-label="close"
                        onClick={e => this.toggleAddToListContainer(e, false)} />
            </div>
        );
    }

    renderList(list) {
        const isRecipeAlreadyInList = list.recipes.includes(this.props.recipeId);

        return (
            <label className="checkbox mb-4" key={list.id}>
                <input className="mr-2"
                       name={list.name}
                       type="checkbox"
                       checked={isRecipeAlreadyInList}
                       onChange={() => this.handleUpdateListRecipes(list, isRecipeAlreadyInList)} />
                {list.name}
            </label>
        );
    }

    render() {
        const {userStore} = this.props.store;

        if (!userStore.isAuthenticated) {
            return null;
        }

        return (
            <div className=" heart-container" onClick={e => this.toggleAddToListContainer(e, true)}>
                <span className={classNames('heart', {liked: this.isLikedRecipe()})} />
                {this.state.isAddToListOpen ? this.renderAddToListModal() : null}
            </div>
        );
    }
}

export default connectToStore(LikeRecipe);
