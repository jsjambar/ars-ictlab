import * as React from 'react'
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router'
import * as api from '../Api'
import { User } from '../Model'
import { UserComponent } from './User'
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

interface LoginState { username:string, password:string, auth:Auth}

export class Login extends React.Component<RouteComponentProps<{}>, LoginState> {

    constructor() {
        super();
        this.state = { 
            username:"", 
            password:"", 
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            }
        };
    }

    componentWillMount(){
        this.check_auth()
        this.handle_auth()
    }

    check_auth(){
       Authentication.check_auth()
       .then(r => this.setState({...this.state, auth:r}))
       .then(() => this.handle_auth())
       .catch(e => console.log(e))
    }

    handle_auth(){
        this.state.auth.permission == 0 ?
            window.location.reload
        :this.state.auth.permission == 1 ?
            window.location.replace('/home')
        : window.location.replace('/admin/classrooms/overview')
    }

    verifyForm():boolean{
        return this.state.username == "" || this.state.password == "" || !this.verifyMailAddress()
    }

    verifyMailAddress():boolean{
        const p = this.state.username
        return p.substr(p.length - 6) == "@hr.nl" && !isNaN(+p.slice(0 , p.length - 6)) && p.length != 6
    }

    loginUser(){
        api.login_user(this.state)
        .then(r => console.log(r))
        .then(() => this.check_auth())
        .then(() => this.handle_auth())
        .catch(e => console.log(e))
    }

    logoutUser(){
        api.logout_user()
        .catch(e => console.log(e))
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
                <button disabled={this.verifyForm()} className="btn btn-primary" onClick={() => this.loginUser()}>Log In</button>
            </div>
            
        </div>
    }
}
