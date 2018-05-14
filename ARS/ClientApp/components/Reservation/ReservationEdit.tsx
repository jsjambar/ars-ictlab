import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Location, Classroom } from '../Model'
import { Link } from 'react-router-dom';

interface ReservationEditState {
    id: 0 | number,
    date: 0 | number,
    start: 0 | number,
    end: 0 | number,
    room: 0 | number,
}

export class ReservationEdit extends React.Component<RouteComponentProps<{}>, ReservationEditState> {
    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            date: 0,
            start: 0,
            end: 0,
            room: 0,
        };
        this.handleChange = this.handleChange.bind(this);
        this.verifyReservation = this.verifyReservation.bind(this);
        this.getReservation = this.getReservation.bind(this);
    }

    getDate(hour) {
        const date = new Date();
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    verifyReservation() {
        const values = this.state;
        // refactor this to a re-usable function
        if (values.room != 0 && values.start != 0 && values.end != 0) {
            this.updateReservation();

        } else {
            console.log("Not valid.");
            // show errors for the missing values
        }
    }

    updateReservation() {
        const values = this.state;
        api.updateReservation(
            values.id,
            new Object({
                id: values.id,
                created_at: this.getDate(values.date),
                start_time: this.getDate(values.start),
                end_time: this.getDate(values.end),
                classroom_id: values.room,
            })
        );
        window.location.replace("/reservation/overview");
    }

    componentWillMount() {
        const { match: { params } } = this.props;
        var reservationId = Object.keys(params).map(function (key) { return params[key] })[0];
        this.getReservation(reservationId);
    }

    getReservation(reservationId) {
        api.getReservation(reservationId)
            .then(reservation => this.setState({
                id: reservation.id,
                date: new Date(reservation.created_at).getFullYear(),
                start: new Date(reservation.start_time).getHours(),
                end: new Date(reservation.end_time).getHours(),
                room: reservation.classroom_id
            }))
            .catch(e => console.log("getReservation, " + e))
    }

    public render() {
        return <div className="reservations">
            <div className="page-header">
                <h1>Edit Reservation {this.state.id}</h1>
            </div>
            <div>
                <p>Please enter the new data to update this reservation.</p>
                <form>
                    <div className="row">
                        <label>Room</label>
                    </div>
                    <div className="row">
                        <input type="text" name="room" placeholder="Classroom name" value={`${this.state.room}`} onChange={this.handleChange} />
                    </div>

                    <div className="row">
                        <label>Reservation time start:</label>
                    </div>
                    <div className="row">
                        <select name="start" value={`${this.state.start}`} onChange={this.handleChange}>
                            <option value="0">Select a start time</option>
                            <option value="9">9:00</option>
                            <option value="10">10:00</option>
                            <option value="11">11:00</option>
                            <option value="12">12:00</option>
                        </select>
                    </div>

                    <div className="row">
                        <label>Reservation time end:</label>
                    </div>
                    <div className="row">
                        <select name="end" value={`${this.state.end}`} onChange={this.handleChange}>
                            <option value="0">Select an end time</option>
                            <option value="13">13:00</option>
                            <option value="14">14:00</option>
                            <option value="15">15:00</option>
                            <option value="16">16:00</option>
                            <option value="17">17:00</option>
                        </select>
                    </div>

                    <br />
                    <div className="row">
                        <button type="button" name="create_classroom" className="btn btn-primary" onClick={this.verifyReservation}>Update Reservation</button>
                        <Link className="btn btn-secondary" to={'/reservation/overview'}>Cancel</Link>
                    </div>
                </form>

            </div>
        </div>;
    }

}
