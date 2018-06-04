import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import * as api from '../components/Api';
import * as immutable from 'immutable'
import { Classroom } from '../components/Model'
import { Reservation } from '../components/Model'
import { ClassroomWithEvents } from '../components/Model'
import { ClassroomComponent } from '../components/classroom/Classroom';
import { Link } from 'react-router-dom'
import "react-big-calendar/lib/css/react-big-calendar.css"

interface ClassroomOverviewState {
    classrooms: immutable.List<Classroom> | immutable.List<Classroom>,
    reservations: immutable.List<Reservation> | "Loading...",
    classroomsWithReservations: Array<ClassroomWithEvents>,
    classroom: String | 0,
    selected: Array<object>,
    cellHeight: 30,
    showModal: false,
    locale: "nl",
    rowsPerHour: 2,
    numberOfDays: 4,
    classRoomArray: Array<Classroom>
}

export type ReservationsState = { reservations: immutable.List<Reservation> | "Loading..." }

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export class Calendar extends React.Component<RouteComponentProps<{}>, ClassroomOverviewState> {
    constructor() {
        super();
        this.state = {
            classrooms: immutable.List<Classroom>(),
            reservations: "Loading...",
            classroomsWithReservations: Array<ClassroomWithEvents>(),
            classroom: 0,
            selected: [],
            cellHeight: 30,
            showModal: false,
            locale: "nl",
            rowsPerHour: 2,
            numberOfDays: 4,
            classRoomArray: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleCellSelection = this.handleCellSelection.bind(this)
        this.handleItemEdit = this.handleItemEdit.bind(this)
        this.handleRangeSelection = this.handleRangeSelection.bind(this)
    }

    handleCellSelection(item) {
        console.log('handleCellSelection', item)
    }
    handleItemEdit(item) {
        console.log('handleItemEdit', item)
    }
    handleRangeSelection(item) {
        console.log('handleRangeSelection', item)
    }

    componentWillMount() {
        this.getReservations();
        this.getClassrooms();
    }

    getClassrooms() {
        api.getClassrooms()
            .then(classrooms => this.setState({ classrooms: classrooms }), () => console.log(this.state))
            .catch(e => console.log("getClassrooms, " + e))
    }

    getClassroomsWithEvents(id) {
        api.getClassroomEvents(id)
            .then(classrooms => this.setState({ classroomsWithReservations: classrooms.toArray() }), () => console.log(this.state.classroomsWithReservations))
            .catch(e => console.log("getClassroomsWithEvents, " + e))
    }

    getReservations() {
        api.get_reservations()
            .then(reservations => this.setState({ reservations: reservations }))
            .catch(e => console.log("getReservations, " + e))
    }

    classroomList() {
        const listItems = this.state.classrooms.map((classroom) =>
            <option value={classroom.id}>
                {classroom.name}
            </option>
        );

        return (
            <select name='classroom' value={`${this.state.classroom}`} onChange={this.handleChange}>
                <option value="0">Select a classroom</option>
                {listItems}
            </select>
        );
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const oldClassroom = this.state.classroom;

        this.setState({...this.state,
            [name]: value
        }, () => {
            this.setState({ classroomsWithReservations: Array<ClassroomWithEvents>() }, () => {
                this.getClassroomsWithEvents(this.state.classroom)
            })
        })

    }

    update() {
        console.log("Updated list.");
    }

    public render() {
        return <div height="200px">
            <BigCalendar views={Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])} events={this.state.classroomsWithReservations} timeslots={3} step={60} showMultiDayTimes />
            <label>Classroom</label>
            {
                this.state.classrooms ?
                    this.classroomList()
                    :
                    null
            }
            {

                this.state.classroomsWithReservations ?
                    this.state.classroomsWithReservations.map((c) => {
                        console.log(c)
                    })   
                    :
                    null
            }
        </div>;
    }
}
