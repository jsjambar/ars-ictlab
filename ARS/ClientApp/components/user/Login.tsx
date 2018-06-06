import * as React from 'react'
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router'
import * as api from '../Api'
import { User } from '../Model'
import { UserComponent } from './User'
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

export type Error = {num:number, msg:string}
interface LoginState { username:string, password:string, auth:Auth, errors:immutable.List<Error>}

export class Login extends React.Component<RouteComponentProps<{}>, LoginState> {

    constructor() {
        super();
        this.state = { 
            errors:immutable.List<Error>(),
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
       .catch(e => this.setState({...this.state, errors:this.state.errors.push({num:1, msg:"Authentication Failed"})}))
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
        .then(() => this.check_auth())
        .then(() => this.setState({...this.state, errors:this.state.errors.push({num:4, msg:"Incorrect Login Data."})}))
        .then(() => this.handle_auth())
        .catch(e => this.setState({...this.state, errors:this.state.errors.push({num:2, msg:"Login Failed."})}))
    }

    logoutUser(){
        api.logout_user()
        .catch(e => this.setState({...this.state, errors:this.state.errors.push({num:3, msg:"Logout Failed."})}))
    }

    public render() {
        return <div>
            {JSON.stringify(this.state)}
            <br />
            {this.state.errors.count()}
            <div className="page-header">
                <h1>Log in to the ARS</h1>
            </div>
            <div>
                {this.state.errors.map(e => {<div>{e.num} - {e.msg}</div>})}
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
