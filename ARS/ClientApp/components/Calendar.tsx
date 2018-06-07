import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import * as api from '../components/Api';
import * as immutable from 'immutable'
import { ClassroomWithEvents } from '../components/Model'
import { Link } from 'react-router-dom'
import "react-big-calendar/lib/css/react-big-calendar.css"

export type CalendarProps = {userid:Number}

interface CalendarState {
    userReservations: Array<ClassroomWithEvents>
}
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export class Calendar extends React.Component<CalendarProps, CalendarState> {
    constructor() {
        super();
        this.state = {
            userReservations: Array<ClassroomWithEvents>()
        };
    }

    componentDidMount() {
        this.getUserEvents(this.props.userid);
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.getUserEvents(this.props.userid);
        }
    }

    getUserEvents(userid) {
        api.getUserEvents(userid)
            .then(events => this.setUserReservations(events))
            .catch(e => console.log("getClassroomsWithEvents, " + e))
    }

    setUserReservations(events){
        var arrReservations = [];
        events.forEach(element => {
            arrReservations.push(
                {
                    title: element.title,
                    start: new Date(element.start),
                    end: new Date(element.end)
                }
            )
        });

        this.setState({ userReservations: arrReservations });
    }

    public render() {
        return <div>
            <BigCalendar 
            views={Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])} 
            events={this.state.userReservations} 
            timeslots={3}
            step={60}
            defaultDate={new Date()}
            defaultView="month"
            showMultiDayTimes />
        </div>;
    }
}
