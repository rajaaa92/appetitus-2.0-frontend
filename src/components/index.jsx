import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { withOktaAuth } from '@okta/okta-react';

import './index.css';
import RecipeEdit from "./RecipeEdit";
import Recipes from "./RecipesList";
import Home from "./Home";
import NavBar from "./NavBar";
import Api from "../services/Api";

const AuthWrapper = withOktaAuth(class WrappedRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: null,
            user: null,
            api: new Api()
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.checkAuthentication = this.checkAuthentication.bind(this);
    }

    async checkAuthentication() {
        const state = this.props.authState;
        if (state.isAuthenticated !== this.state.authenticated) {
            if (state.isAuthenticated) {
                const user = await this.props.authService.getUser();
                let accessToken = await state.accessToken;
                this.setState({ authenticated: state.isAuthenticated, user, api: new Api(accessToken) });
            }
            else {
                this.setState({ authenticated: state.isAuthenticated, user: null, api: new Api() });
            }
        }
    }

    async componentDidMount() {
        this.checkAuthentication();
    }

    async componentDidUpdate() {
        this.checkAuthentication();
    }

    async login() {
        if (this.state.authenticated === null) return; // do nothing if auth isn't loaded yet
        this.props.authService.login('/');
    }

    async logout() {
        this.props.authService.logout('/');
    }

    render() {
        let {authenticated, user, api} = this.state;

        if (authenticated === null) {
            return null;
        }

        const navbar = <NavBar
            isAuthenticated={authenticated}
            login={this.login}
            logout={this.logout}
        />;

        return (
            <Switch>
                <Route
                    path='/'
                    exact={true}
                    render={(props) => <Home {...props} authenticated={authenticated} user={user} api={api} navbar={navbar} />}
                />
                <SecureRoute
                    path='/recipes'
                    exact={true}
                    render={(props) => <Recipes {...props} authenticated={authenticated} user={user} api={api} navbar={navbar}/>}
                />
                <SecureRoute
                    path='/recipes/:id'
                    render={(props) => <RecipeEdit {...props} authenticated={authenticated} user={user} api={api} navbar={navbar}/>}
                />
            </Switch>
        )
    }
});

class App extends Component {
    render() {
        return (
            <Router>
                <Security issuer={process.env.REACT_APP_OKTA_OAUTH2_ISSUER}
                          clientId={process.env.REACT_APP_OKTA_OAUTH2_CLIENT_ID}
                          redirectUri={window.location.origin + '/callback'}
                          pkce={true}>
                    <Route path='/callback' component={LoginCallback} />
                    <AuthWrapper />
                </Security>
            </Router>
        )
    }
}

export default App;
