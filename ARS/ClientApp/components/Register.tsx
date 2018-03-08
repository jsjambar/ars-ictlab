import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from './Api'
import { User } from './User'

export type RegisterState = {
    username:string
    password:string
}

export class Register extends React.Component<RouteComponentProps<{}>, RegisterState> {
    constructor() {
        super();
        this.state = {username:"",password:""};
    }

    setUser(){
        const user:User = {
            Id:1,
            Username:this.state.username,
            Password:this.state.password
        }

        api.set_user(user)
        .then(r => console.log(r))
        .catch(e => console.log(e))
    }

    public render() {
        return <div>
            <h1>Register page.</h1>
            <input type="text"
                    placeholder="Username"
                    onChange={e => this.setState({...this.state, username:e.currentTarget.value})}
            />
            <br />
            <input type="password"
                    placeholder="Password"
                    onChange={e => this.setState({...this.state, password:e.currentTarget.value})}
            />
            <br /><br />
            <button className="btn btn-primary" disabled={this.state.username == "" || this.state.password == ""} onClick={() => this.setUser()}>Register</button>
            <p>{JSON.stringify(this.state)}</p>
        </div>
    }

}
