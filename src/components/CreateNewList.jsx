import React from 'react';
import { postData } from '../utils.js';
import { STRAPI_BASE_PROD } from '../constants.js';
import { connectToStore } from '../store/InitStore.js';

export class CreateNewList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            listName: '',
        }
    }

    get listParams() {
        const {userStore} = this.props.store;

        return {
            name: this.state.listName,
            user: {id: userStore.id}
        }
    }

    handleUpdateListName(e) {
        e.preventDefault();
        this.setState({listName: e.target.value});
    }

    createNewList() {
        const {userStore, loaderStore} = this.props.store;

        loaderStore.startLoader();
        postData(`${STRAPI_BASE_PROD}lists`, this.listParams).then(data => {
            // Add new list to the user's lists
            userStore.addToLists({...data, user: data.user.id});
            this.setState({listName: ''});
            loaderStore.stopLoader();
        }).catch(e => {
            alert(e.message);
            this.setState({listName: ''});
            loaderStore.stopLoader();
        });
    }

    render() {
        return (
            <div className="create-list">
                <input className="input is-small"
                       name="listName"
                       type="text"
                       placeholder="Enter new list name..."
                       value={this.state.listName}
                       onChange={e => this.handleUpdateListName(e)}
                />
                <button className="button is-success mr-4"
                        disabled={this.state.listName.length < 1}
                        onClick={e => this.createNewList(e)}>
                    Create List
                </button>
            </div>
        );
    }
}

export default connectToStore(CreateNewList);
