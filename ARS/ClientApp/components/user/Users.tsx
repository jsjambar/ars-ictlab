import * as React from 'react';
import * as immutable from 'immutable'
import * as api from '../Api'
import * as Authentication from '../Authentication'
import { RouteComponentProps } from 'react-router';
import { User, Error } from '../Model'
import { UserComponent } from './User' 
import { UserForm } from './UserForm'
import { Auth } from '../Authentication'

// State of user component
export type UsersState = {
    page:Page
    users:immutable.List<User>|"Loading...",
    errors:immutable.List<Error>,
    auth:Auth,
}

// Type of Pages
export type Page = UsersPage|AddUserPage|UserPage
export type UsersPage = {name:"show"}
export type AddUserPage = {name:"add"}
export type UserPage = {name:"user",user:User}

export class Users extends React.Component<RouteComponentProps<{}>, UsersState> {
    constructor() {
        super();
        this.state = { 
            errors:immutable.List<Error>(),
            page:{name:"show"},
            users:"Loading...",
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            }
        };
    }

    // Check the authentication of the user when mounting and handle accordingly
    componentWillMount():void{
        this.check_auth();
    }

    // Check the authentication of the user and handle accordingly
    check_auth():void{
        Authentication.check_auth()
        .then(r => this.setState({...this.state, auth:r}))
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }
 
    // Handle authentication of the user
    handle_auth():void{
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        :this.state.auth.permission == 1 ?
            window.location.replace('/home')
        : this.handle_admin()
    }

    // Handle authentication of admin
    handle_admin():void{
        this.setState({...this.state, errors:immutable.List<Error>()})
        this.getUsers();
    }

    // Set errors if they dont exist already
    set_error(error:Error):void{
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    // Request users from database
    getUsers():void{
        api.get_users()
        .then(users => this.setState({users:users}))
        .catch(e => this.set_error({num:12, msg:"Users not found."}))
    }

    // Add user to database
    setUser(user:User):void{
        api.set_user(user)
        .then(_ => this.switchPage({name:"show"}))
        .then(_ => this.getUsers())
        .catch(e => this.set_error({num:13, msg:"There was a problem adding the user."}))
    }

    // Remove user from database
    deleteUser(id:number):void{
        api.delete_user(id)
        .then(_ => this.switchPage({name:"show"}))
        .then(_ => this.getUsers())
        .catch(e => this.set_error({num:14, msg:"There was a problem removing the user."}))
    }

    updateUser(u:User):void{
        api.update_user(u)
        .then(_ => this.switchPage({name:"show"}))
        .then(_ => this.getUsers())
        .catch(e => this.set_error({num:12, msg:"There was a problem updating the user."}))
    }

    switchPage(page:Page):void{
        this.setState({...this.state, page:page})
    }

    public render() {
        return <div>
            <div className="page-header row">
                <h1>Users</h1>
                <div>
                    {
                        this.state.errors.map(e => {
                        return <div className="alert alert-danger" role="alert">
                                <p>{e.msg}</p>
                        </div>
                        })
                    }
                </div>
                <div className="headerBtn">
                    <button className="btn btn-primary" onClick={() => this.switchPage({ name: "add" })}>Add User</button>
                </div>
            </div>
            {
                this.state.page.name == "show" ? 
                    this.state.users != "Loading..." ?
                        <div className="row tbl">
                            <div className="row head">
                                <strong className="col-xs-1 first">#</strong>
                                <strong className="col-xs-2">Firstname</strong>
                                <strong className="col-xs-3">Lastname</strong>
                                <strong className="col-xs-3">Username</strong>
                                <strong className="col-xs-3 last"></strong>
                            </div>
                            <div className="row body">
                                {
                                    // Show users
                                    this.state.users.map((u, k) => {
                                        return <div className="row">
                                            <strong className="col-xs-1 first">{u.id}</strong>
                                            <div className="col-xs-2">{u.first_name}</div>
                                            <div className="col-xs-3">{u.last_name}</div>
                                            <div className="col-xs-3">{u.username}</div>
                                            <div className="col-xs-3 last">
                                                <button className="btn btn-primary" onClick={() => this.switchPage({ name: "user", user: u })}>Show</button>
                                                <button className="btn btn-danger btn-last" onClick={() => this.deleteUser(u.id)}>Delete</button>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    :"Loading..."
                : this.state.page.name == "add" ?
                    <div>
                        <button className="btn btn-primary" onClick={() => this.switchPage({name:"show"})}>
                            Show Users
                        </button>
                        <hr />  
                        <UserForm setUser={u => this.setUser(u)} />
                    </div>
                : this.state.page.name == "user" ?
                    <div>
                        <button className="btn btn-primary" onClick={() => this.switchPage({name:"show"})}>
                            Show Users
                        </button>
                        <hr />  
                        <UserComponent user={this.state.page.user} deleteUser={id => this.deleteUser(id)} updateUser={u => this.updateUser(u)} />
                    </div>
                : null
            }
        </div>
    }
}
