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
            iframe:  "https://calendar.google.com/calendar/embed?src=" + user.Username + "&ctz=Europe%2FAmsterdam"
        }, () => console.log("user: " + JSON.stringify(user))))
        .catch(e => console.log("getUser, " + e))
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>Schedule</h1>
                {
                    this.state.user != 0 && this.state.iframe != "" ?
                    <div>
                        {console.log(this.state.user.Username)}
                        <iframe src={`${this.state.iframe}`} width='1200px' height='800' scrolling='no'></iframe>
                    </div>
                    :
                    ""
                }
            </div>
        </div>
    }
}
