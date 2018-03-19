import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { User } from '../Model'
import { UserComponent } from './User'

interface ScheduleState { user : User|0, iframe: String|"" }

export class Schedule extends React.Component<RouteComponentProps<{}>, ScheduleState> {

    constructor() {
        super();
        this.state = { user : 0, iframe : "" };
    }

    componentWillMount(){
        this.getUser()
    }

    getUser(){
        api.getUser(1)
        .then(user => this.setState({
            user: user, 
            iframe:  "https://calendar.google.com/calendar/embed?src=" + user.Username + "@hr.nl&ctz=Europe%2FAmsterdam"
        }))
        .catch(e => console.log("getUser, " + e))
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>?????</h1>
            </div>
            <div>
                {
                    this.state.user != 0 && this.state.iframe != "" ?
                    <div>
                        <iframe src={`${this.state.iframe}`} width='100%' height='650' scrolling='no' frameBorder='0'></iframe>
                    </div>
                    :
                    ""
                }
            </div>
        </div>
    }
}
