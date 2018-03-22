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
                <th scope="row">{this.props.user.id}    </th>
                <td>{this.props.user.first_name}</td>
                <td>{this.props.user.last_name}</td>
                <td>{this.props.user.username}</td>
            </tr>
    }

}
