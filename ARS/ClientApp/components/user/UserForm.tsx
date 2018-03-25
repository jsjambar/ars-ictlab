import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { User } from '../Model'

export type UserFormProps = {setUser:(u:User) => void}
export type UserFormState = {user:User}

export class UserForm extends React.Component<UserFormProps, UserFormState> {
    constructor() {
        super();
        this.state = {
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

    verifyForm():boolean{
        const u = this.state.user
        return u.username == "" ||
        u.first_name == "" ||
        u.last_name == "" ||
        u.password == "" || 
        u.role_id == 0
    }

    public render() {
        return <div className="row">
            {JSON.stringify(this.state.user)}
            <input className="form-control" type="text" placeholder="Username" onChange={e => this.setState({...this.state, user:{...this.state.user, username:e.currentTarget.value}})} /><br />
            <input className="form-control" type="text" placeholder="Firstname" onChange={e => this.setState({...this.state, user:{...this.state.user, first_name:e.currentTarget.value}})} /><br />
            <input className="form-control" type="text" placeholder="Lastname" onChange={e => this.setState({...this.state, user:{...this.state.user, last_name:e.currentTarget.value}})} /><br />
            <input className="form-control"type="password" placeholder="Password" onChange={e => this.setState({...this.state, user:{...this.state.user, password:e.currentTarget.value}})} /><br />
            <select className="form-control" onChange={e => this.setState({...this.state, user:{...this.state.user, role_id:+e.currentTarget.value}})} >
                <option value="0">Select Role   </option>
                <option value="1">Student</option>
                <option value="2">Administrator</option>
            </select>
            <br />
            <button disabled={this.verifyForm()} className="btn btn-primary" onClick={() => this.props.setUser(this.state.user)}>Add User</button>
        </div>
    }

}
