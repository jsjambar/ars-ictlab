import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { User } from '../Model'
import { UserComponent } from './User' 
import { UserForm } from './UserForm'

export type UsersState = {
    page:Page
    users:immutable.List<User>|"Loading..."
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
            page:{
                name:"show"
            },
            users:"Loading..." 
        };
    }

    componentWillMount(){
        this.getUsers()
    }

    getUsers(){
        api.get_users()
        .then(users => this.setState({users:users}))
        .catch(e => console.log("getUsers, " + e))
    }

    setUser(user:User){
        console.log("User: " + JSON.stringify(user))

        api.set_user(user)
        .then(m => console.log("success, " + m))
        .then(_ => this.switchPage({name:"show"}))
        .then(_ => this.getUsers())
        .catch(e => console.log("error, " + e))
    }

    deleteUser(id:number){
        api.delete_user(id)
        .then(m => console.log("success, " + m))
        .then(_ => this.switchPage({name:"show"}))
        .then(_ => this.getUsers())
        .catch(e => console.log("error, " + e))
    }

    updateUser(u:User){
        api.update_user(u)
        .then(m => console.log("success, " + m))
        .then(_ => this.switchPage({name:"show"}))
        .then(_ => this.getUsers())
        .catch(e => console.log("error, " + e))
    }

    switchPage(page:Page){
        this.setState({...this.state, page:page})
    }

    public render() {
        return <div>
            <div className="page-header row">
                <h1>Users</h1>
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
                                <strong className="col-xs-3">Firstname</strong>
                                <strong className="col-xs-3">Lastname</strong>
                                <strong className="col-xs-2">Username</strong>
                                <strong className="col-xs-3 last"></strong>
                            </div>
                            <div className="row body">
                                {
                                    this.state.users.map((u, k) => {
                                        return <div>
                                            <strong className="col-xs-1 first">{u.id}</strong>
                                            <div className="col-xs-3">{u.first_name}</div>
                                            <div className="col-xs-3">{u.last_name}</div>
                                            <div className="col-xs-2">{u.username}</div>
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
