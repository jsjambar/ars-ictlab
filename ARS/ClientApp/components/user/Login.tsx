import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { User } from '../Model'
import { UserComponent } from './User'
import * as auth from '../Authentication';

interface LoginState { username : String|"", password: String|"" }

export class Login extends React.Component<RouteComponentProps<{}>, LoginState> {

    constructor() {
        super();
        this.state = { username : "", password : "" };
    }

    componentWillMount(){
        this.isLoggedIn();
    }

    isLoggedIn(){
        if(auth.isLoggedIn()){
            // replace with something that isnt native js
            window.location.replace('/home');
        }
        return this.checkCredentials();
    }

    checkCredentials(){
        auth.checkCredentials(this.state.username, this.state.password);
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>Log in to the ARS</h1>
            </div>
            <div>
            <label>Username</label>
            <input type="text" name="username" placeholder="Username" value={`${this.state.username}`}/>
            <br/>
            <input type="password" name="password" placeholder="Password"/>
            </div>
        </div>
    }
}
