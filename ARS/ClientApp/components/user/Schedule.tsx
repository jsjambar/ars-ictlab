import * as React from 'react';
import * as immutable from 'immutable'
import * as api from '../Api'
import * as Authentication from '../Authentication'
import { RouteComponentProps } from 'react-router';
import { User, Error } from '../Model'
import { UserComponent } from './User'
import { Calendar } from '../Calendar'
import { Auth } from '../Authentication'

// State of schedule component
export type ScheduleState = {auth:Auth, errors:immutable.List<Error>}

export class Schedule extends React.Component<RouteComponentProps<{}>, ScheduleState> {

    constructor() {
        super();
        this.state = {
            errors:immutable.List<Error>(),
            auth:{
                is_loggedin:false,
                user:null,
                permission:0 // 0 = No Permission, 1 = Student, 2 = Administrator
            }
        }
    }

    // Check the authentication of the user when mounting and handle accordingly
    componentWillMount():void{
        this.check_auth()
    }
 
    // Check the authentication of the user and handle accordingly
    check_auth():void{
        Authentication.check_auth()
        .then(r => this.setState({...this.state, auth:r}))
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Something went wrong checking the permission."}))
    }

    // Handle authentication of the user
    handle_auth():void{
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        :this.state.auth.permission == 2 ?
            this.handle_admin()
        :null
    }

    // Handle authentication of student
    handle_user():void{
        this.setState({...this.state, errors:immutable.List<Error>()})
    }

    // Handle authentication of admin
    handle_admin():void{
        this.setState({...this.state, errors:immutable.List<Error>()})
        window.location.replace('/admin/classrooms/overview')
    }

    // Set errors if they dont exist already
    set_error(error:Error):void{
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        :null
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>Your schedule</h1>
            </div>
            <div>
                {
                    // Show errors
                    this.state.errors.map(e => {
                       return <div className="alert alert-danger" role="alert">
                            <p>{e.msg}</p>
                       </div>
                    })
                }
            </div>
            {
                // Show calendar if student
                this.state.auth.user ?
                <div>
                    <Calendar userid={this.state.auth.user.id}/>
                </div>
                :
                null
            }
        </div>
    }
}
