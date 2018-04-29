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
            iframe:  "https://calendar.google.com/calendar/embed?src=" + user.username + "@hr.nl&ctz=Europe%2FAmsterdam&language=nl"
        }))
        .catch(e => console.log("getUser, " + e))
    }

    logout_user(){
        api.logout_user()
        .then(() => window.location.replace('/login'))
        .catch(console.log)
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>Your schedule</h1>
            </div>
            <button className="btn btn-danger" onClick={() => this.logout_user()}>Logout</button>
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
