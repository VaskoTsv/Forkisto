import React from 'react';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import { APIError, postData } from '../../utils.js';
import { STRAPI_BASE_PROD, STRAPI_TOKEN_KEY, USER_DATA_KEY } from '../../constants.js';
import { connectToStore } from '../../store/InitStore.js';

export class Authentication extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLogin: true,
            ...this.initialLoginState,
            ...this.initialRegistrationState,
        };
    }

    get initialLoginState() {
        return {
            loginEmail: '',
            loginPassword: '',
        }
    }

    get initialRegistrationState() {
        return {
            registerUsername: '',
            registerEmail: '',
            registerPassword: '',
        }
    }

    get loginData() {
        return {
            identifier: this.state.loginEmail,
            password: this.state.loginPassword,
        }
    }

    get registerData() {
        return {
            username: this.state.registerUsername,
            email: this.state.registerEmail,
            password: this.state.registerPassword,
        }
    }

    handleTabChange(isLogin) {
        this.setState({
            isLogin: isLogin,
            ...this.initialLoginState,
            ...this.initialRegistrationState,
        });
    }

    handleUserInfoChange({target}) {
        this.setState({
            [target.name]: target.value,
        });
    }

    setUserDataCookies(data) {
        Cookies.set(STRAPI_TOKEN_KEY, data.jwt, {expires: 7});
        Cookies.set(USER_DATA_KEY, {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            confirmed: data.user.confirmed,
            blocked: data.user.blocked,
            role: data.user.role,
            lists: data.user.lists,
        }, {expires: 7});
    }

    async submitRegistration(e) {
        e.preventDefault();
        const {userStore, loaderStore} = this.props.store;

        let data;

        loaderStore.startLoader();
        try {
            data = await postData(`${STRAPI_BASE_PROD}auth/local/register`, this.registerData)
        } catch (e) {
            if (e instanceof APIError) {
                alert(e.responseErrorMessage.messages[0].message);
            }
            return;
        } finally {
            loaderStore.stopLoader();
        }

        this.setUserDataCookies(data);
        userStore.setUserData(data.user);
        this.props.history.push('/');
    }

    async submitLogIn(e) {
        e.preventDefault();
        const {userStore, loaderStore} = this.props.store;

        let data;

        loaderStore.startLoader();
        try {
            data = await postData(`${STRAPI_BASE_PROD}auth/local`, this.loginData);
        } catch (e) {
            if (e instanceof APIError) {
                alert(e.responseErrorMessage.messages[0].message);
            }
            return;
        } finally {
            loaderStore.stopLoader();
        }

        this.setUserDataCookies(data);
        userStore.setUserData(data.user);
        this.props.history.push('/');
    }

    renderRegisterForm() {
        return (
            <React.Fragment>
                <div className="field">
                    <label htmlFor="" className="label">Name</label>
                    <div className="control">
                        <input className="input"
                               type="text"
                               name="registerUsername"
                               placeholder="e.g. John Doe"
                               required={true}
                               onChange={e => this.handleUserInfoChange(e)}
                        />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="" className="label">Email</label>
                    <div className="control">
                        <input className="input"
                               type="email"
                               name="registerEmail"
                               placeholder="e.g. bobsmith@gmail.com"
                               required
                               onChange={e => this.handleUserInfoChange(e)} />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="" className="label">Password</label>
                    <div className="control">
                        <input className="input"
                               type="password"
                               name="registerPassword"
                               placeholder="*******"
                               required
                               onChange={e => this.handleUserInfoChange(e)} />
                    </div>
                </div>
                <div className="field">
                    <button className="button is-info mr-4"
                            onClick={e => this.submitRegistration(e)}>
                        Register
                    </button>
                </div>
            </React.Fragment>
        );
    }

    renderLogInForm() {
        return (
            <React.Fragment>
                <div className="field">
                    <label htmlFor="" className="label">Email</label>
                    <div className="control">
                        <input type="email" name="loginEmail"
                               placeholder="e.g. bobsmith@gmail.com"
                               className="input" required
                               onChange={e => this.handleUserInfoChange(e)} />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="" className="label">Password</label>
                    <div className="control">
                        <input type="password" placeholder="*******"
                               name="loginPassword"
                               className="input" required
                               onChange={e => this.handleUserInfoChange(e)} />
                    </div>
                </div>
                <div className="field">
                    <button className="button is-success"
                            onClick={e => this.submitLogIn(e)}>
                        Login
                    </button>
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <section className="hero is-primary is-fullheight">
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-centered">
                            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                                <form action="" className="box">
                                    <div className="tabs">
                                        <ul>
                                            <li className={classNames({'is-active': this.state.isLogin})}
                                                onClick={() => this.handleTabChange(true)}>
                                                <a>LogIn</a>
                                            </li>
                                            <li className={classNames({'is-active': !this.state.isLogin})}
                                                onClick={() => this.handleTabChange(false)}>
                                                <a>Register</a>
                                            </li>
                                        </ul>
                                    </div>
                                    {this.state.isLogin ? this.renderLogInForm() : null}
                                    {!this.state.isLogin ? this.renderRegisterForm() : null}
                                    <p>If you have problems logging in or need to reset your
                                        password contact me at: vask_o@abv.bg</p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default connectToStore(Authentication);
