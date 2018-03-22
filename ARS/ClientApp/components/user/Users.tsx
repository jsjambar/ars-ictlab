import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { User } from '../Model'
import { UserComponent } from './User' 
import { UserForm } from './UserForm'

export type UsersState = {
    page:"show"|"add"
    users:immutable.List<User>|"Loading..."
}

export type UsersData = {}

export class Users extends React.Component<RouteComponentProps<{}>, UsersState> {
    constructor() {
        super();
        this.state = { 
            page:"show",
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
        .then(_ => this.switchPage("show"))
        .catch(e => console.log("error, " + e))
    }

    switchPage(page:"show"|"add"){
        this.setState({...this.state, page:page})
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>Users</h1>
            </div>
            {
                this.state.page == "show" ? 
                    <div>
                        <button className="btn btn-primary" onClick={() => this.switchPage("add")}>
                        Add User
                        </button>
                        <hr />
                    </div> 
                : null
            }
            {
                this.state.page == "show" ?
                    this.state.users != "Loading..." ?
                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Firstname</th>
                                        <th scope="col">Lastname</th>
                                        <th scope="col">Username</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.users.map((u,k) => <UserComponent key={k} user={u} />)}
                                </tbody>
                            </table>
                        </div>
                    :"Loading..."
                : 
                    <UserForm setUser={u => this.setUser(u)} />
            }
        </div>
    }

}
