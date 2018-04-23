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
        var created_at = new Date(this.props.reservation.created_at);
        var start_time = new Date(this.props.reservation.start_time);
        var end_time = new Date(this.props.reservation.end_time);

        return <tr>
            <th scope="row">{this.props.reservation.id}</th>
            <td>{this.props.reservation.classroom_id}</td>
            <td>{created_at.getDate () + "-" + (created_at.getMonth()+1) + "-" + created_at.getFullYear()}</td>
            <td>{start_time.getHours() + ":" + ((start_time.getMinutes() < 10 ? '0' : '') + start_time.getMinutes())}</td>
            <td>{end_time.getHours() + ":" + ((end_time.getMinutes() < 10 ? '0' : '') + end_time.getMinutes())}</td>
            <td>
                <Link className="btn btn-primary" to={`/reservation/${this.props.reservation.id}/edit`}>Edit</Link>
                <button type="button" className="btn btn-primary btn-danger" name="delete_reservation" onClick={this.confirmDeletion.bind(this.props.reservation.id)}>Delete</button>
            </td>

        </tr>
    }

}
