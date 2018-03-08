import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from './Api'

export type User = {
    Id:number,
    Username:string,
    Password:string
}

export type UsersState = {users:immutable.List<User>}

export class Users extends React.Component<RouteComponentProps<{}>, UsersState> {
    constructor() {
        super();
        this.state = { users:immutable.List<User>() };
    }

    componentWillMount(){
        this.getUsers()
    }

    getUsers(){
        api.get_users()
        .then(users => this.setState({...this.state, users:users}))
        .catch(e => console.log(e))
    }

    public render() {
        return <div>
            <h1>User page.</h1>
            <br />
            <p><button onClick={() => this.getUsers()}>Load users</button></p>
            {JSON.stringify(this.state.users)}
        </div>
    }

}
