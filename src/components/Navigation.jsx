import React from 'react';
import { NavLink } from 'react-router-dom'
import MAIN_LOGO from '../images/forkisto-logo.png';

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

    renderLoginButtons() {
        // TODO implement authentication and authorization at some point
        return null;

        return (
            <div className="navbar-end">
                <div className="navbar-item">
                    <div className="buttons">
                        <a className="button is-primary">
                            <strong>Sign up</strong>
                        </a>
                        <a className="button is-light">
                            Log in
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <NavLink className="navbar-item" to="/">
                        <img src={MAIN_LOGO} draggable="false"/>
                    </NavLink>
                    {this.renderBurgerNav()}
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">
                        <NavLink  className="navbar-item" to="/">
                            Home
                        </NavLink >
                        <NavLink  className="navbar-item" to="/about">
                            About
                        </NavLink >
                        {/*<a className="navbar-item">*/}
                        {/*    Favourites*/}
                        {/*</a>*/}
                    </div>

                    {this.renderLoginButtons()}
                </div>
            </nav>
        );
    }
}
