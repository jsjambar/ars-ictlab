import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Location, Classroom } from '../Model' 
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

interface ReservationEditState {
    id: 0 | number, 
    date: 0 | Date,
    chosen_date: Object,
    start: 0 | number,
    end: 0 | number,
    room: 0 | number
}

export class ReservationEdit extends React.Component<RouteComponentProps<{}>, ReservationEditState> {
    constructor(props) {
        super(props);
        this.state = { 
            id: 0,
            date: 0,
            chosen_date: moment(),
            start: 0,
            end: 0,
            room: 0,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.verifyReservation = this.verifyReservation.bind(this);
        this.getReservation = this.getReservation.bind(this);
    }

    getDate(hour){
        const date = new Date();
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour);
    }

    handleChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
            [name] : value
        });
    }

    handleDateChange(date) {
        this.setState({
          chosen_date: date
        }) 
        this.setDateFromObject(date);
    }

    setDateFromObject(obj){
        const self = this;
        Object.keys(obj).map(function(keyName, keyIndex) {
            if(keyName == '_d' && obj[keyName] !== null){
                self.setState({
                    date: new Date(obj[keyName])
                })
            }
        });
    }

    verifyReservation(){
        const values = this.state;
        // refactor this to a re-usable function
        if (values.room != 0 && values.start != 0 && values.end != 0){
            this.updateReservation();
        } else {
            console.log("Not valid.");
        }
    }

    updateReservation() {
        const values = this.state;
        api.updateReservation(
            values.id,
            new Object({
                id: values.id,
                created_at: this.getDate(0),
                date_of_reservation: values.date,
                start_time: this.getDate(values.start), 
                end_time: this.getDate(values.end),
                classroom_id: values.room,
            })
        );
        window.location.replace("/reservation/overview");
    }

    componentWillMount(){
        const { match: { params } } = this.props;
        var reservationId = Object.keys(params).map(function (key) { return params[key] })[0];
        this.getReservation(reservationId);
    }
    
    getReservation(reservationId) {
        api.getReservation(reservationId)
            .then(reservation => this.setState({
                id: reservation.id,
                chosen_date: moment(reservation.date_of_reservation),
                start: new Date(reservation.start_time).getHours(),
                end: new Date(reservation.end_time).getHours(),
                room: reservation.classroom_id,
            }, () => this.setDateFromObject(this.state.chosen_date) ))
            .catch(e => console.log("getReservation, " + e))
    }
    
    public render() {
        return <div>
            <div className="page-header">
                <h1>Edit Reservation {this.state.id}</h1>
                <p>Please enter the new data to update this reservation.</p>
                <form>
                    <label>Room</label>
                    <input type="text" name="room" placeholder="Classroom name" value={`${this.state.room}`} onChange={this.handleChange} />
                    <br/>

                    <label>Date:</label>
                    {
                        this.state.date != 0 ?
                        <DatePicker minDate={moment()} selected={this.state.chosen_date} onChange={this.handleDateChange}/>
                        :
                        ""
                    }

                    <label>Reservation time start:</label>
                    <select name="start" value={`${this.state.start}`} onChange={this.handleChange}>
                        <option value="0">Select a start time</option>
                        <option value="9">9:00</option>
                        <option value="10">10:00</option>
                        <option value="11">11:00</option>
                        <option value="12">12:00</option>
                    </select>
                    <br/>

                    <label>Reservation time end:</label>
                    <select name="end" value={`${this.state.end}`} onChange={this.handleChange}>
                        <option value="0">Select an end time</option>
                        <option value="13">13:00</option>
                        <option value="14">14:00</option>
                        <option value="15">15:00</option>
                        <option value="16">16:00</option>
                        <option value="17">17:00</option>
                    </select>
                    <br />
                    <button type="button" name="create_classroom" className="btn btn-primary" onClick={this.verifyReservation}>Update Reservation</button>
                    <Link className="btn btn-primary" to={'/reservation/overview'}>Cancel</Link>
                </form>

            </div>
        </div>;
    }

}
