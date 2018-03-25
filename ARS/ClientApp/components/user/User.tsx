import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { User } from '../Model'

export type UserComponentProps = {user:User, deleteUser:(id:number)=>void}

export class UserComponent extends React.Component<UserComponentProps, {}> {
    constructor() {
        super();
        this.state = {};
    }

    public render() {
        return  <div> 
            <table>
                <tbody>
                    <tr>
                        <td scope="row"><strong>Username: </strong></td>
                        <td>{this.props.user.username}</td>
                    </tr>
                    <tr>
                        <td scope="row"><strong>Firstname: </strong></td>
                        <td>{this.props.user.first_name}</td>
                    </tr>
                    <tr>
                        <td scope="row"><strong>Lastname: </strong></td>
                        <td>{this.props.user.last_name}</td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <button className="btn btn-primary" onClick={() => console.log("Edit")}>
                Edit
            </button>
            &nbsp;
            <button className="btn btn-danger" onClick={() => this.props.deleteUser(this.props.user.id)}>
                Delete
            </button>
        </div>
    }

}
