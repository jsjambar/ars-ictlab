import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import BigCalendar from 'react-big-calendar';
import * as moment from 'moment';
import * as api from '../components/Api';
import * as immutable from 'immutable'
import { Classroom } from '../components/Model'
import { Reservation } from '../components/Model'
import { ClassroomComponent } from '../components/classroom/Classroom';
import { Link } from 'react-router-dom'

interface ClassroomOverviewState {
    classrooms: immutable.List<Classroom> | "Loading...",
    reservations: immutable.List<Reservation> | "Loading...",
    classroomsWithReservations: immutable.List<object>
}

export type ReservationsState = { reservations: immutable.List<Reservation> | "Loading..." }

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export class Calendar extends React.Component<RouteComponentProps<{}>, ClassroomOverviewState> {
    constructor() {
        super();
        this.state = {
            classrooms: "Loading...",
            reservations: "Loading...",
            classroomsWithReservations: immutable.List<object>()
        };
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

    getReservations() {
        api.get_reservations()
            .then(reservations => this.setState({ reservations: reservations }))
            .catch(e => console.log("getReservations, " + e))
    }

    update() {
        console.log("Updated list.");
    }

    public render() {
        return <div height="100%">
            {
                this.state.classrooms != "Loading..." ?
                    //this.state.classrooms.map((c, k) => <BigCalendar events={} key={k} classroom={c} />) : "Loading..."
                    this.state.classrooms.map((value, key) => {
                        //console.log(`Classrooms: Value  is ${JSON.stringify(value)}, ID is ${value.id}`)
                    }) : "Loading"
            }

            {
                //this.state.reservations != "Loading..." ?
                //    this.state.reservations.map((reservationValue, reservationKey) => {
                //        //this.state.classroomsWithReservations.push(Object.assign({}, value.classroom_id, this.state.classrooms[key]))
                //        //console.log(JSON.stringify(this.state.classroomsWithReservations))
                //        //console.log(`Reservations: Value is ${JSON.stringify(value)}`)
                //        if (this.state.classrooms != "Loading...") {
                //            this.state.classrooms.map((classroomValue, classroomKey) => {
                //                //console.log(`Classrooms: Value  is ${JSON.stringify(value)}, ID is ${value.id}`)
                //                if (reservationValue.classroom_id == classroomValue.id) {
                //                    this.state.classroomsWithReservations.push({ classroomId: classroomValue.id, reservation: reservationValue });
                //                }
                //            })
                //        }
                //    }) : "Loading"

                this.state.classrooms != "Loading..." ?
                    this.state.classrooms.map((classroomValue, classroomKey) => {
                        //this.state.classroomsWithReservations.push(Object.assign({}, value.classroom_id, this.state.classrooms[key]))
                        //console.log(JSON.stringify(this.state.classroomsWithReservations))
                        //console.log(`Reservations: Value is ${JSON.stringify(value)}`)
                        if (this.state.reservations != "Loading...") {
                            this.state.reservations.map((reservationValue, reservationKey) => {
                                //console.log(`Classrooms: Value  is ${JSON.stringify(reservationValue)}, ID is ${reservationValue.id}`)
                                //console.log(JSON.stringify(reservationValue));
                                if (reservationValue.classroom_id === classroomValue.id) {
                                    //this.state.classroomsWithReservations.push(Object.assign({}, classroomValue, this.state.reservations[reservationKey]));
                                    //console.log("yo");
                                    this.state.classroomsWithReservations.concat(Object.assign({}, classroomValue, this.state.reservations[reservationKey]))
                                    console.log(JSON.stringify(this.state.classroomsWithReservations))
                                }
                            })
                        }
                    }) : "Loading"
            }
        </div>;
    }
}
