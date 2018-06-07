import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { User, Error } from '../Model'
import { UserComponent } from './User'
import { Calendar } from '../Calendar'

import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

export type NavMenuState = {auth:Auth, errors:immutable.List<Error>}

export class Schedule extends React.Component<RouteComponentProps<{}>, NavMenuState> {

    constructor() {
        super();
        this.state = {
            errors:immutable.List<Error>(),
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            }
        }
    }

    componentWillMount(){
        this.check_auth()
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => this.setState({...this.state, auth:r}))
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>Your schedule</h1>
            </div>
            <div>
                {
                    this.state.errors.map(e => {
                       return <div className="alert alert-danger" role="alert">
                            <p>{e.msg}</p>
                       </div>
                    })
                }
            </div>
            {
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
