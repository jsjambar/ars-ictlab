import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { User } from '../Model'

export type UserComponentProps = {user:User, key:number}

export class UserComponent extends React.Component<UserComponentProps, {}> {
    constructor() {
        super();
        this.state = {};
    }

    public render() {
        return <tr>
                <th scope="row">{this.props.user.userId}</th>
                {/* <td>{this.props.user.Firstname}</td>
                <td>{this.props.user.Lastname}</td>
                <td>{this.props.user.Username}</td> */}
            </tr>
    }

}
