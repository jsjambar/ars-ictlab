import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import * as api from '../components/Api';
import * as immutable from 'immutable'
import { ClassroomWithEvents } from '../components/Model'
import { Link } from 'react-router-dom'
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Error } from './Model'

export type CalendarProps = {userid:Number}

interface CalendarState {
    userReservations: Array<ClassroomWithEvents>,
    errors:immutable.List<Error>
}
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export class Calendar extends React.Component<CalendarProps, CalendarState> {
    constructor() {
        super();
        this.state = {
            errors:immutable.List<Error>(),
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
            .catch(e => this.set_error({num:15, msg:"User Events Not Found."}))
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
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
            <div>
                {
                    this.state.errors.map(e => {
                       return <div className="alert alert-danger" role="alert">
                            <p>{e.msg}</p>
                       </div>
                    })
                }
            </div>
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
