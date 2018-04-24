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
        // this.isLoggedIn();
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

    verifyForm():boolean{
        return this.state.username == "" || this.state.password == ""
    }

    public render() {
        return <div>
            {JSON.stringify(this.state)}
            <div className="page-header">
                <h1>Log in to the ARS</h1>
            </div>
            <div className="row">
                <input className="form-control" type="text" placeholder="Username" onChange={e => this.setState({...this.state, username:e.currentTarget.value})} /><br />
                <input className="form-control" type="password" placeholder="Password" onChange={e => this.setState({...this.state, password:e.currentTarget.value})}  /><br />
                <br />
                <button disabled={this.verifyForm()} className="btn btn-primary" onClick={() => console.log(this.state.username + " " + this.state.password)}>Add User</button>
            </div>
            
        </div>
    }
}
