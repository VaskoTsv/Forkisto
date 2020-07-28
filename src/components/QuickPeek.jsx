import React from 'react';
import classNames from 'classnames';
import {generateRandomId, removeHtmlFromText} from '../utils.js';
import {connectToStore} from '../store/InitStore.js';

export class QuickPeek extends React.Component {
    closeModal() {
        const {recipesStore, quickPeekStore} = this.props.store;

        quickPeekStore.closeModal();
        recipesStore.setRecipeDetails(null);
    }

    get initialRecipeDetails() {
        return {
            title: '',
            image: null,
            readyInMinutes: null,
            healthScore: null,
            spoonacularScore: null,
            dishTypes: [],
            summary: '',
            instructions: '',
        };
    }

    get getRecipeDetails() {
        const {recipesStore} = this.props.store;

        if (!recipesStore.recipeDetails) {
            return this.initialRecipeDetails;
        }

        return recipesStore.recipeDetails;
    }

    render() {
        const {quickPeekStore} = this.props.store;

        return (
            <div className="quick-peek">
                <div className={classNames('modal', {'is-active': quickPeekStore.isShowModal})}>
                    <div className="modal-background" onClick={() => this.closeModal()}/>
                    <div className="modal-content">
                        <button className="modal-close is-large" aria-label="close"
                            onClick={() => this.closeModal()}/>
                        <div className="title">{this.getRecipeDetails.title}</div>
                        <div className="info-container">
                            <div className="image-container">
                                <img src={this.getRecipeDetails.image} alt="Recipe image"/>
                            </div>
                            <div className="quick-info">
                                <div className="info">
                                    <p><strong>Time to cook:</strong> {this.getRecipeDetails.readyInMinutes} min</p>
                                    <p><strong>Health score:</strong> {this.getRecipeDetails.healthScore}</p>
                                    <p><strong>Spoonacular score:</strong> {this.getRecipeDetails.spoonacularScore}%</p>
                                </div>
                                <div className="info">
                                    <strong>Dish types: </strong>
                                    {this.getRecipeDetails.dishTypes.map(type => (
                                        <span key={generateRandomId()}
                                              className="info-badge">{type}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="description-container mb-4">
                            <h4 className="title is-4">Recipe summary:</h4>
                            <p className="subtitle is-6">
                                {removeHtmlFromText(this.getRecipeDetails.summary)}
                            </p>
                        </div>
                        <div className="description-container mb-4">
                            <h4 className="title is-4">Recipe instructions:</h4>
                            <p className="subtitle is-6">{this.getRecipeDetails.instructions}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connectToStore(QuickPeek);
