import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { User } from '../Model'
import { UserComponent } from './User'
import { Calendar } from '../Calendar'

import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

export type NavMenuState = {auth:Auth}

export class Schedule extends React.Component<RouteComponentProps<{}>, NavMenuState> {

    constructor() {
        super();
        this.state = {
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
        .catch(e => console.log(e))
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>Your schedule</h1>
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
