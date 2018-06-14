import * as React from 'react'
import * as immutable from 'immutable'
import * as api from '../Api'
import * as Authentication from '../Authentication'
import { RouteComponentProps } from 'react-router'
import { User, Error } from '../Model'
import { UserComponent } from './User'
import { Auth } from '../Authentication'

// State of login component
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
                permission:0 // 0 = No Permission, 1 = Student, 2 = Administrator
            }
        };
    }

    // Check the authentication of the user when mounting and handle accordingly
    componentWillMount():void{
        this.check_auth() 
    }
    
    // Check the authentication of the user and handle accordingly
    check_auth():void{
       Authentication.check_auth() 
       .then(r => this.setState({...this.state, auth:r})) 
       .then(() => this.handle_auth()) 
       .catch(e => this.set_error({num:1, msg:"Something went wrong checking the permission."}))
    }
    
    // Handle authentication of the user
    handle_auth():void{
        this.state.auth.permission == 0 ?
            window.location.reload 
        :this.state.auth.permission == 1 ?
            this.handle_user() 
        : this.handle_admin() 
    }

    // Handle authentication of student
    handle_user():void{
        this.setState({...this.state, errors:immutable.List<Error>()})
        window.location.replace('/home')
    }
    
    // Handle authentication of admin
    handle_admin():void{
        this.setState({...this.state, errors:immutable.List<Error>()})
        window.location.replace('/admin/classrooms/overview')
    }
    
    // Set errors if they dont exist already
    set_error(error:Error):void{
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    // Verify login form
    verifyForm():boolean{
        return this.state.username == "" || this.state.password == "" || !this.verifyMailAddress()
    }

    // Verify username
    verifyMailAddress():boolean{
        const p = this.state.username
        return p.substr(p.length - 6) == "@hr.nl" && !isNaN(+p.slice(0 , p.length - 6)) && p.length != 6
    }

    // Login user
    loginUser():void{
        api.login_user(this.state)
        .then((r) => r.response == 0 ? this.set_error({num:4, msg:"Incorrect Login Data."}) : this.setState({...this.state, errors:immutable.List<Error>()}))
        .then(() => this.check_auth())
        .catch(e => this.set_error({num:2, msg:e}))
    }

    // Logout user
    logoutUser():void{
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
                    // Show errors
                    this.state.errors.map((e,k) => {
                       return <div key={k} className="alert alert-danger" role="alert">
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
