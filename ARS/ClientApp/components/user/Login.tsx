import * as React from 'react'
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router'
import * as api from '../Api'
import { User, Error } from '../Model'
import { UserComponent } from './User'
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

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
    }

    check_auth(){
       Authentication.check_auth()
       .then(r => this.setState({...this.state, auth:r}))
       .then(() => this.handle_auth())
       .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }

    handle_auth(){
        this.state.auth.permission == 0 ? 
            window.location.reload
        :this.state.auth.permission == 1 ?
            this.handle_user()
        : this.handle_admin()
    }

    handle_user(){
        this.setState({...this.state, errors:immutable.List<Error>()})
        window.location.replace('/home')
    }

    handle_admin(){
        this.setState({...this.state, errors:immutable.List<Error>()})
        window.location.replace('/admin/classrooms/overview')
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
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
        .then(() => !this.state.auth.is_loggedin ? this.set_error({num:4, msg:"Incorrect Login Data."}) : null)
        .catch(e => this.set_error({num:2, msg:"Login Failed."}))
    }

    logoutUser(){
        api.logout_user()
        .catch(e => this.set_error({num:3, msg:"Logout Failed."}))
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>Log in to the ARS</h1>
            </div>
            <div className="col">
                {
                    this.state.errors.map(e => {
                       return <div className="alert alert-danger" role="alert">
                            <p>{e.msg}</p>
                       </div>
                    })
                }
            </div>
            <div className="row">
                <input className="form-control" type="text" placeholder="Username" onChange={e => this.setState({...this.state, username:e.currentTarget.value})} /><br />
                <input className="form-control" type="password" placeholder="Password" onChange={e => this.setState({...this.state, password:e.currentTarget.value})}  /><br />
                <br />
                <button disabled={this.verifyForm()} className="btn btn-primary btn-full-width-mobile" onClick={() => this.loginUser()}>Log In</button>
            </div>
            
        </div>
    }
}
