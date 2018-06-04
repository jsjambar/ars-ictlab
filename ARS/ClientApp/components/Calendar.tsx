import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import * as api from '../components/Api';
import * as immutable from 'immutable'
import { ClassroomWithEvents } from '../components/Model'
import { Link } from 'react-router-dom'
import "react-big-calendar/lib/css/react-big-calendar.css"

export type CalendarProps = {selectedClassroom:String}
interface CalendarState {
    classroomsWithReservations: Array<ClassroomWithEvents>
}
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export class Calendar extends React.Component<CalendarProps, CalendarState> {
    constructor() {
        super();
        this.state = {
            classroomsWithReservations: Array<ClassroomWithEvents>()
        };
    }

    componentDidMount() {
        this.getClassroomsWithEvents(this.props.selectedClassroom);
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.getClassroomsWithEvents(this.props.selectedClassroom);
        }
    }

    getClassroomsWithEvents(id) {
        api.getClassroomEvents(id)
            .then(events => this.setClassroomReservations(events))
            .catch(e => console.log("getClassroomsWithEvents, " + e))
    }

    setClassroomReservations(events){
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

        this.setState({ classroomsWithReservations: arrReservations });
    }

    public render() {
        return <div>
            <BigCalendar 
            views={Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])} 
            events={this.state.classroomsWithReservations} 
            timeslots={3}
            step={60}
            defaultDate={new Date()}
            defaultView="month"
            showMultiDayTimes />
        </div>;
    }
}
