import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { User } from '../Model'
import { UserComponent } from './User' 

export type UsersState = {users:immutable.List<User>|"Loading..."}

export class Users extends React.Component<RouteComponentProps<{}>, UsersState> {
    constructor() {
        super();
        this.state = { users:"Loading..." };
    }

    componentWillMount(){
        this.getUsers()
    }

    getUsers(){
        api.get_users()
        .then(users => this.setState({users:users}))
        .catch(e => console.log("getUsers, " + e))
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>Users</h1>
            </div>
            {console.log(this.state.users)}
            {
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
            }
        </div>
    }

}
