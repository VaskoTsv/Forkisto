import React from 'react';
import { NavLink } from 'react-router-dom'
import Cookies from 'js-cookie';
import { connectToStore } from '../store/InitStore.js';
import MAIN_LOGO from '../images/forkisto-logo.png';
import { STRAPI_TOKEN_KEY, USER_DATA_KEY } from '../constants.js';

export class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.navbarBurger = React.createRef();
    }

    componentDidMount() {
        if (this.navbarBurger.current) {
            this.navbarBurger.current.addEventListener('click', this.handleBurgerToggle.bind(this));
        }
    }

    componentWillUnmount() {
        if (this.navbarBurger.current) {
            this.navbarBurger.current.removeEventListener('click', this.handleBurgerToggle.bind(this));
        }
    }

    handleBurgerToggle() {
        const element = this.navbarBurger.current;

        // Get the target from the "data-target" attribute
        const target = element.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        element.classList.toggle('is-active');
        $target.classList.toggle('is-active');
    }

    handleLogout(e) {
        e.preventDefault();
        const {userStore} = this.props.store;

        userStore.clearUserData();
        Cookies.remove(STRAPI_TOKEN_KEY);
        Cookies.remove(USER_DATA_KEY);

        // Return to home page
        window.location = window.location.origin;
    }

    renderBurgerNav() {
        return (
            <a ref={this.navbarBurger} role="button" className="navbar-burger burger"
               aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        )
    }

    renderLoginButton() {
        return (
            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons">
                        <NavLink className="button is-primary" to="/auth">
                            Log in / Register
                        </NavLink>
                    </div>
                </div>
            </div>
        )
    }

    renderUserInfo() {
        const {userStore} = this.props.store;

        return (
            <div className="navbar-end">
                <div className="navbar-item">
                    <h2 className="subtitle mb-0 mr-4">{userStore.username}</h2>
                    <button className="button is-light"
                            onClick={e => this.handleLogout(e)}>Logout
                    </button>
                </div>
            </div>
        );
    }

    render() {
        const {userStore} = this.props.store;

        return (
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <NavLink className="navbar-item" to="/">
                        <img src={MAIN_LOGO} draggable="false" />
                    </NavLink>
                    {this.renderBurgerNav()}
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <NavLink className="navbar-item" to="/">
                            Home
                        </NavLink>
                        <NavLink className="navbar-item" to="/about">
                            About
                        </NavLink>
                        {userStore.isAuthenticated ?
                            <NavLink className="navbar-item" to="/lists">Lists</NavLink> : null
                        }
                    </div>

                    {!userStore.isAuthenticated ? this.renderLoginButton() : null}
                    {userStore.isAuthenticated ? this.renderUserInfo() : null}
                </div>
            </nav>
        );
    }
}

export default connectToStore(Navigation);
