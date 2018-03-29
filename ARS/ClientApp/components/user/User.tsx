import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { User } from '../Model'

export type UserComponentProps = {user:User, deleteUser:(id:number)=>void, updateUser:(u:User)=>void}
export type UserComponentState = {type:"show"|"edit", user:User}

export class UserComponent extends React.Component<UserComponentProps, UserComponentState> {
    constructor() {
        super();
        this.state = {
            type:"show", 
            user:{
                id:0,
                username:"",
                first_name:"",
                last_name:"",
                password:"",
                role_id:0
            } 
        }
    }

    componentWillMount(){
        this.setState({...this.state, user:this.props.user})
    }

    public render() {
        return  <div> 
            {
                this.state.type == "show" ?
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
                : 
                    <div>
                        <input className="form-control" type="text" value={this.state.user.first_name} placeholder="Firstname" onChange={e => this.setState({...this.state, user:{...this.state.user, first_name:e.currentTarget.value}})} /><br />
                        <input className="form-control" type="text" value={this.state.user.last_name} placeholder="Lastname" onChange={e => this.setState({...this.state, user:{...this.state.user, last_name:e.currentTarget.value}})} /><br />
                    </div>
            }
            <hr />
            {
                this.state.type == "edit" ?
                    <button className="btn btn-primary" onClick={() => this.props.updateUser(this.state.user)}>
                        Save
                    </button>
                : 
                    <button className="btn btn-primary" onClick={() => this.setState({...this.state, type:"edit"})}>
                        Edit
                    </button>

            }
            &nbsp;
            <button className="btn btn-danger" onClick={() => this.props.deleteUser(this.props.user.id)}>
                Delete
            </button>
        </div>
    }

}
