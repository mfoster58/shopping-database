import React, { Component } from "react";
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
    Navigate
} from "react-router-dom"

import { FormErrors } from "./FormErrors";


class LogIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            redirect: false,
            // infoPassed: null,
        };
    }

    handleChange = event => {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        });
    }

    handleRedirect = (data) => {
        // console.log(JSON.stringify(data));
        if (data.success) {
            // this.setState({redirect: false});
            // console.log(JSON.stringify(this.state));
            this.setState({ redirect: true });
            // this.setState({infoPassed: {
            //     // token: data.token,
            //     username: data.username,
            //     account_type: data.account_type,
            //     balance: data.balance}});
            // console.log(JSON.stringify(this.state));

            this.props.setUser(data.username, data.account_type);
        } else {
            alert(data.message);
        }
    }

    onFormSubmit = (event) => {
        const data = { 'username': this.state.username, 'password': this.state.password };

        const url = "http://localhost:8080/backend/login.php"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.handleRedirect(data))
            .catch(err => console.error(err));
    }


    render() {
        let { username, password, redirect } = this.state;

        if (redirect) {
            return <Navigate to={{
                pathname: "/home",
                // state: infoPassed // your data array of objects
            }} />;
        }

        return (
            <div className="login">
                <form>
                    <p>
                        <label for="username">Username:</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            //value={username}
                            onChange={this.handleChange} />
                    </p>
                    <p>
                        <label for="password">Password:</label>
                        <input
                            type="text"
                            name="password"
                            id="password"
                            //value={password}
                            onChange={this.handleChange} />
                    </p>
                    <p>
                        <button type="button" onClick={this.onFormSubmit}>
                            Submit
                        </button>
                    </p>
                </form>
            </div>
        );
    }
}

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            password: null,
            account_type: null,
            redirect: false,
            // ref: https://learnetto.com/blog/react-form-validation
            formErrors: { username: '', password: '', account_type: '' },
            usernameValid: false,
            passwordValid: false,
            account_typeValid: false,
            formValid: false
            // end of citation
            // infoPassed: {},
        };
    }


    handleChange = event => {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        }, () => { this.validateField(name, value) });
    }

    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        let usernameValid = this.state.usernameValid;
        let passwordValid = this.state.passwordValid;
        let account_typeValid = this.state.account_typeValid;

        switch (fieldName) {
            case 'username':
                usernameValid = value.match(/^[\w_\-]+$/i);
                fieldValidationErrors.username = usernameValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '' : ' is too short';
                break;
            case 'account_type':
                account_typeValid = value != null;
                fieldValidationErrors.account_type = account_typeValid ? '' : ' is not determined';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            usernameValid: usernameValid,
            passwordValid: passwordValid,
            account_typeValid: account_typeValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({ formValid: (this.state.usernameValid && this.state.passwordValid) && this.state.account_typeValid });
    }

    handleRedirect = (data) => {
        console.log(JSON.stringify(data));
        if (data.success) {
            // this.setState({redirect: false});
            // console.log(JSON.stringify(this.state));
            this.setState({ redirect: true });
            // this.setState({infoPassed: {
            //     // token: data.token,
            //     username: data.username,
            //     account_type: data.account_type,
            //     balance: data.balance}});
            this.props.setUser(data.username, data.account_type);
            // console.log(JSON.stringify(this.state));
        } else {
            alert(data.message);
        }

    }

    onFormSubmit = (event) => {
        const data = { 'username': this.state.username, 'password': this.state.password, 'account_type': this.state.account_type };

        const url = "http://localhost:8080/backend/register.php"
        //alert(url);

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
            .then(response => response.json())
            //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
            .then(data => this.handleRedirect(data))
            .catch(err => console.error(err));

        //this.setState({redirect:true});
    }


    render() {
        let { username, password, account_type, redirect } = this.state;

        if (redirect) {
            return <Navigate to={{
                pathname: "/home",
                // state: infoPassed // your data array of objects
            }} />;
        }

        return (
            <div className="register">
                <form>
                    <p>
                        <label for="username">Username:</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            // value={username}
                            onChange={this.handleChange} />
                    </p>
                    <p>
                        <label for="password">Password:</label>
                        <input
                            type="text"
                            name="password"
                            id="password"
                            // value={password}
                            onChange={this.handleChange} />
                    </p>
                    {/* {itemList} */}
                    <p>
                        <label for="account_type">Register as:</label>
                        <input
                            type="radio"
                            name="account_type"
                            id="seller"
                            value="seller"
                            onClick={this.handleChange} />
                        <label for="seller">seller</label>
                        <input
                            type="radio"
                            name="account_type"
                            id="buyer"
                            value="buyer"
                            onClick={this.handleChange} />
                        <label for="buyer">buyer</label>
                    </p>
                    <p>
                        <button type="button" disabled={!this.state.formValid} onClick={this.onFormSubmit}>
                            Submit
                        </button>
                    </p>
                </form>
                <div className="panel panel-default">
                    <FormErrors formErrors={this.state.formErrors} />
                </div>
            </div >
        );
    }
}

class LoginPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="LoginPage">
                <header>Welcome to our shopping site!</header>
                <br />
                <header>Login here</header>
                <LogIn setUser={this.props.setUser} />
                <br />
                <header>Or register a new user</header>
                <Register setUser={this.props.setUser} />
            </div>
        );
    }
}

// const LoginPage = (props) => {
//     props.history.push("/home")
//     return (<Body />);
// }


export default LoginPage;