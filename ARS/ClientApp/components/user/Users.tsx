import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { User, Error } from '../Model'
import { UserComponent } from './User' 
import { UserForm } from './UserForm'
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

export type UsersState = {
    page:Page
    users:immutable.List<User>|"Loading...",
    errors:immutable.List<Error>,
    auth:Auth,
}

export type UsersData = {}

export type Page = UsersPage|AddUserPage|UserPage
export type UsersPage = {name:"show"}
export type AddUserPage = {name:"add"}
export type UserPage = {name:"user",user:User}

export class Users extends React.Component<RouteComponentProps<{}>, UsersState> {
    constructor() {
        super();
        this.state = { 
            errors:immutable.List<Error>(),
            page:{
                name:"show"
            },
            users:"Loading...",
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            }
        };
    }

    componentWillMount(){
        this.check_auth();
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => this.setState({...this.state, auth:r}))
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }
 
    handle_auth(){
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        :this.state.auth.permission == 1 ?
            window.location.replace('/home')
        : this.handle_admin()
    }

    handle_admin(){
        this.setState({...this.state, errors:immutable.List<Error>()})
        this.getUsers();
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    getUsers(){
        api.get_users()
        .then(users => this.setState({users:users}))
        .catch(e => this.set_error({num:12, msg:"Users Not Found"}))
    }

    setUser(user:User){
        api.set_user(user)
        .then(_ => this.switchPage({name:"show"}))
        .then(_ => this.getUsers())
        .catch(e => this.set_error({num:12, msg:"Users Not Found"}))
    }

    deleteUser(id:number){
        api.delete_user(id)
        .then(_ => this.switchPage({name:"show"}))
        .then(_ => this.getUsers())
        .catch(e => this.set_error({num:12, msg:"Users Not Found"}))
    }

    updateUser(u:User){
        api.update_user(u)
        .then(_ => this.switchPage({name:"show"}))
        .then(_ => this.getUsers())
        .catch(e => this.set_error({num:12, msg:"Users Not Found"}))
    }

    switchPage(page:Page){
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
