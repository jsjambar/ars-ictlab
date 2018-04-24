import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { User } from '../Model'
import { UserComponent } from './User'
import * as auth from '../Authentication';

export type RegisterState = { user:User, success:"pending"|true|false }
export type RegisterProps = {}



export class Register extends React.Component<RouteComponentProps<{}>, RegisterState> {

    constructor() {
        super();
        this.state = {
            user:{
                id:0,
                username:"",
                first_name:"",
                last_name:"",
                password:"",
                role_id:1
            },
            success:"pending"
       }
    }

    componentWillMount(){
        //auth
    }

    verifyForm():boolean{
        const u = this.state.user
        return u.username != "" &&
        u.first_name != "" &&
        u.last_name != "" &&
        u.password != "" &&
        this.verifyMailAddress()
    }

    verifyMailAddress():boolean{
        const p = this.state.user.username
        return p.substr(p.length - 6) == "@hr.nl" && !isNaN(+p.slice(0 , p.length - 6))
    }

    setUser(user:User){
        console.log("User: " + JSON.stringify(user))
        api.set_user(user)
        .then(m => console.log("success, " + m))
        .then(() => this.setState({...this.state, success:true}))
        .catch(e => {console.log("error, " + e); this.setState({...this.state, success:false})})
    }

    public render() {
        return <div>
            {JSON.stringify(this.state)}
            <div className="page-header">
                <h1>Register</h1>
            </div>
            
            {
                this.state.success == "pending" ?
                    <div className="row">
                        <input className="form-control" type="text" placeholder="School Mail" onChange={e => this.setState({...this.state, user:{...this.state.user, username:e.currentTarget.value}})} /><br />
                        <input className="form-control" type="text" placeholder="Firstname" onChange={e => this.setState({...this.state, user:{...this.state.user, first_name:e.currentTarget.value}})} /><br />
                        <input className="form-control" type="text" placeholder="Lastname" onChange={e => this.setState({...this.state, user:{...this.state.user, last_name:e.currentTarget.value}})} /><br />
                        <input className="form-control"type="password" placeholder="Password" onChange={e => this.setState({...this.state, user:{...this.state.user, password:e.currentTarget.value}})} /><br />
                        <br />
                        <button disabled={!this.verifyForm()} className="btn btn-primary" onClick={() => this.setUser(this.state.user)}>Add User</button>
                    </div>
                : this.state.success ?
                    <div className="alert alert-success">
                        {this.state.user.username} has successfully registered.
                    </div>
                : 
                    <div className="alert alert-success">
                        Something went wrong with your registration.
                    </div>
            }
        </div>
    }
}
