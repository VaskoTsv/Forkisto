import { observable, action } from 'mobx';
import Cookies from 'js-cookie';
import { USER_DATA_KEY } from '../constants.js';

// This is needed, because Strapi returns null if there are no recipes in list.recipes variable
// and our front end logic is based on list.recipes being an array at all times.
function modifyEmptyRecipes(lists) {
    // TODO this is a quick fix, it is not a good practise to modify the data directly,
    //  implement some kind of a pure function solution in the future.
    lists.forEach(list => {
        if (!list.recipes) {
            list.recipes = [];
        }
    })
}

const storedUser = Cookies.getJSON(USER_DATA_KEY);

if (storedUser) {
    modifyEmptyRecipes(storedUser.lists);
}

function updateUserDataCookies(userData, updatedLists) {
    Cookies.set(USER_DATA_KEY, {
        ...userData,
        lists: updatedLists,
    }, {expires: 7});
}

export class UserStore {
    @observable
    id = storedUser ? storedUser.id : null;
    @observable
    username = storedUser ? storedUser.username : '';
    @observable
    email = storedUser ? storedUser.email : '';
    @observable
    isAuthenticated = Boolean(storedUser);
    @observable
    confirmed = storedUser ? storedUser.confirmed : false;
    @observable
    blocked = storedUser ? storedUser.username : false;
    @observable
    role = storedUser ? storedUser.role : null;
    @observable
    lists = storedUser ? storedUser.lists : [];

    getUserData() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            isAuthenticated: this.isAuthenticated,
            confirmed: this.confirmed,
            blocked: this.blocked,
            tole: this.role,
            lists: this.lists,
        }
    }

    @action
    setUserData(user) {
        modifyEmptyRecipes(user.lists);
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.isAuthenticated = true;
        this.confirmed = user.confirmed;
        this.blocked = user.blocked;
        this.role = user.role;
        this.lists = user.lists;
    }

    @action
    clearUserData() {
        this.id = null;
        this.username = '';
        this.email = '';
        this.isAuthenticated = false;
        this.confirmed = false;
        this.blocked = false;
        this.role = null;
        this.lists = [];
    }

    @action
    addToLists(list) {
        this.lists.push(list);

        modifyEmptyRecipes(this.lists);
        updateUserDataCookies(this.getUserData(),this.lists);
    }

    @action
    updateList(list) {
        const targetIndex = this.lists.findIndex(listItem => listItem.id === list.id)
        this.lists.splice(targetIndex, 1, list);

        modifyEmptyRecipes(this.lists);
        updateUserDataCookies(this.getUserData(), this.lists);
    }

    @action
    removeFromLists(list) {
        const targetIndex = this.lists.findIndex(listItem => listItem.id === list.id)
        this.lists.splice(targetIndex, 1);

        modifyEmptyRecipes(this.lists);
        updateUserDataCookies(this.getUserData(), this.lists);
    }
}

const _userStore = new UserStore();
export default _userStore;
