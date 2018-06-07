import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom'
import { Reservation } from '../Model'
import * as api from '../Api'

export type ReservationComponentProps = { reservation: Reservation, key: number }

export class ReservationComponent extends React.Component<ReservationComponentProps, {}> {
    constructor() {
        super();
        this.state = { };
    }

    confirmDeletion() {
        var wantsToDelete = window.confirm("Are you sure you want to delete this reservation?");
        if (wantsToDelete) {
            var reservationId = this;
            api.deleteReservation(reservationId).then(function (deleted) {
                if (deleted) {
                    location.reload();
                }
            });
        }
    }

    public render() {
        var date_of_reservation = new Date(this.props.reservation.date_of_reservation);
        var start_time = new Date(this.props.reservation.start_time);
        var end_time = new Date(this.props.reservation.end_time);

        return <div className="row">
            <strong className="col-xs-1 first">{this.props.reservation.id}</strong>
            <div className="col-xs-2">{this.props.reservation.classroom_id}</div>
            <div className="col-xs-3 col-sm-2">{date_of_reservation.getDay() + "-" + date_of_reservation.getMonth() + "-" + date_of_reservation.getFullYear()}</div>
            <div className="col-xs-2">{start_time.getHours() + ":" + start_time.getMinutes()}</div>
            <div className="col-xs-2">{end_time.getHours() + ":" + end_time.getMinutes()}</div>
            <div className="col-xs-2 col-sm-3 last">
                <Link className="btn btn-primary" to={`/reservation/${this.props.reservation.id}/edit`}>Edit</Link>
                <button type="button" className="btn btn-primary btn-danger btn-last" name="delete_reservation" onClick={this.confirmDeletion.bind(this.props.reservation.id)}>Delete</button>
            </div>

        </div>
    }

}
