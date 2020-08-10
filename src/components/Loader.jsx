import React from 'react';
import { connectToStore } from '../store/InitStore.js';

export class Loader extends React.Component {
    render() {
        const {loaderStore} = this.props.store;

        if (!loaderStore.isLoading) {
            return null;
        }

        return (
            <div className="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
    }
}

export default connectToStore(Loader);
