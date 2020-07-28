import React from 'react';
import {handleAnimation} from '../utils.js';
import {PLACEHOLDER_IMAGE} from '../constants.js';

export class RecipeCardPlaceholder extends React.Component {
    constructor(props) {
        super(props);

        this.cardPlaceholder = React.createRef();
        this.animationInterval = null;
    }

    componentDidMount() {
        this.animationInterval = handleAnimation(
            false,
            this.cardPlaceholder.current,
            'active',
            500,
        );
    }

    componentWillUnmount() {
        clearInterval(this.animationInterval);
    }

    render() {
        return (
            <div ref={this.cardPlaceholder} className="card card-placeholder">
                <div className="card-image">
                    <figure className="image is-4by3">
                        <img src={PLACEHOLDER_IMAGE}
                             alt="Placeholder image"/>
                    </figure>
                </div>
                <div className="card-content">
                    <div className="media">
                        <div className="media-content">
                            <p className="title is-4"></p>
                            <p className="subtitle is-6"></p>
                        </div>
                    </div>

                    <div className="content"></div>
                </div>
            </div>
        );
    }
}
