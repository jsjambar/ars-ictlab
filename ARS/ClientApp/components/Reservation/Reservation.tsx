// Imports
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Reservation, Classroom, Error } from '../Model';
import { getClassroom } from '../Api';
import * as api from '../Api';

// Helpers
import * as immutable from 'immutable';
import * as moment from 'moment';

// Props that gets used
export type ReservationComponentProps = {
    reservation: Reservation,
    key: number
}

// State that gets used
interface ReservationState {
    classroom: Classroom
}

export class ReservationComponent extends React.Component<ReservationComponentProps, ReservationState>{
    constructor() {
        super();
        // Default values
        this.state = {
            classroom: {
                id: 0,
                name: "",
                start_time: new Date,
                end_time: new Date,
                location_id: 0,
                is_public: false,
                is_disabled: true,
                qr_code: ""
            }
        };
    }
    
    componentWillMount() {
        this.getClassroom();
    }

    // Start getting the Classroom that the Reservation is booked on
    // This is needed for showing the name of the Classroom
    getClassroom() {
        api.getClassroom(this.props.reservation.classroom_id)
            .then(classroom => { this.setState({ classroom: classroom }) })
            .catch(e => {
                var tempClassroom = this.state.classroom;
                tempClassroom.name = "Not Found";
                this.setState({ classroom: tempClassroom })
            })
    }

    // When Delete button is pressed you need to confirm deletion
    confirmDeletion() {
        var wantsToDelete = window.confirm("Are you sure you want to delete this reservation?");

        // When Deletion is confirmed the Reservation will be deleted
        if (wantsToDelete) {
            var reservationId = this;
            api.deleteReservation(reservationId).then(function (deleted) {
                if (deleted) {
                    location.reload();
                }
            });
        }
    }

    // Start Rendering the Reservation Data
    public render() {

        // Create Cariables for showing correct Time/Date format
        var date_of_reservation = moment(this.props.reservation.date_of_reservation);
        var start_time = new Date(this.props.reservation.start_time);
        var end_time = new Date(this.props.reservation.end_time);

        return <div className="row">
            <strong className="col-xs-1 first">{this.props.reservation.id}</strong>
            <div className="col-xs-2">{this.state.classroom.name}</div>
            <div className="col-xs-3 col-sm-2">{date_of_reservation.date() + "-" + (date_of_reservation.month()+1) + "-" + date_of_reservation.year()}</div>
            <div className="col-xs-2">{start_time.getHours() + ":" + (start_time.getMinutes()<10? '0' : '') + start_time.getMinutes()}</div>
            <div className="col-xs-2">{end_time.getHours() + ":" + (end_time.getMinutes()<10? '0' : '') + end_time.getMinutes()}</div>
            <div className="col-xs-2 col-sm-3 last">
                <Link className="btn btn-primary" to={`/reservation/${this.props.reservation.id}/edit`}>Edit</Link>
                <button type="button" className="btn btn-primary btn-danger btn-last" name="delete_reservation" onClick={this.confirmDeletion.bind(this.props.reservation.id)}>Delete</button>
            </div>

        </div>
    }

}
