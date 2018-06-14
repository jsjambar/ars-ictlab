// Imports
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Location, Classroom, Error } from '../Model';
import * as api from '../Api';
import { Link } from 'react-router-dom';

// Helpers
import * as moment from 'moment';
import * as immutable from 'immutable';
import * as helper from '../Datehelper';

// DatePicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Authentication
import * as Authentication from '../Authentication';
import { Auth } from '../Authentication';

// State that gets used
interface ReservationEditState {
    id: 0 | number, 
    date: 0 | Date,
    chosen_date: Object,
    start: 0 | Number,
    end: 0 | Number,
    room: 0 | number,
    timeslot: Number,
    errors:immutable.List<Error>,
    auth:Auth
}

export class ReservationEdit extends React.Component<RouteComponentProps<{}>, ReservationEditState> {
    constructor(props) {
        super(props);
        // Default values
        this.state = {
            errors:immutable.List<Error>(),
            id: 0,
            date: new Date(),
            chosen_date: moment(),
            start: 0,
            end: 0,
            room: 0,
            timeslot: 0,
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.verifyReservation = this.verifyReservation.bind(this);
        this.getReservation = this.getReservation.bind(this);
    }

    // Begin authentication and getting the startup data
    componentWillMount():void{
        this.check_auth();
    }

    check_auth():void{
        Authentication.check_auth()
            .then(r => this.setState({ ...this.state, auth: r }))
            .then(() => this.handle_auth())
            .catch(e => this.set_error({ num: 1, msg: "Authentication Failed" }))
    }

    handle_auth():void{
        this.state.auth.permission == 0 ?
            window.location.replace('/')
        : this.handle_user()
    }

    handle_user():void{
        this.setState({ ...this.state, errors: immutable.List<Error>() })
        const { match: { params } } = this.props;
        var reservationId = Object.keys(params).map(function (key) { return params[key] })[0];
        this.getReservation(reservationId);
    }
    // End authentication and getting the startup data

    // Handle change of values
    handleChange(event):void{
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => this.setStartAndEnd(this.state.timeslot));
    }

    // Unique date onchange method to format the date from the datepicker object
    handleDateChange(date):void{
        this.setState({
            chosen_date: date
        })
        this.setDateFromObject(date);
    }

    // Set the start and end time because we process it in terms of timeslots and save it as start and end time
    setStartAndEnd(chosenTimeslot):void{
        let processedDate = helper.getDateByTimeslot(chosenTimeslot);

        this.setState({
            start: processedDate.start,
            end: processedDate.end
        });
    }

    // Gets the date from the datepicker object
    setDateFromObject(obj):void{
        const self = this;
        Object.keys(obj).map(function(keyName, keyIndex) {
            if(keyName == '_d' && obj[keyName] !== null){
                self.setState({
                    date: new Date(obj[keyName])
                })
            }
        });
    }

    // Checks if values are valid and then save the reservation
    verifyReservation():void{
        const values = this.state;
        // refactor this to a re-usable function
        if (values.room != 0 && values.start != 0 && values.end != 0) {
            this.updateReservation();
        } else {
            this.set_error({num:7, msg:"Please fill in the fields"});
        }
    }

    // Start updating the Reservation
    updateReservation():void{
        const values = this.state;
        var res = api.updateReservation(
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
        
        var pass = true;
        var self = this;
        res.then(function(response){
            if(response.error == 1){
                pass = false;
            } else {
                if(self.state.auth.permission == 2){
                    window.location.replace('/admin/reservations/overview')
                } else {
                    window.location.replace('/reservation/overview');
                }
            }
        })

        if(!pass){
            this.set_error({num:6, msg:"Timeslot already taken"});
        }
    }

    // Convert to UTC date
    getDate(hour):Date{
        const date = new Date();
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour);
    }

    // Start getting the Reservation that needs to be shown
    getReservation(reservationId):void{
        api.getReservation(reservationId)
            .then(reservation => this.setState({
                id: reservation.id,
                chosen_date: moment(reservation.date_of_reservation).hour(10),
                start: new Date(reservation.start_time).getHours(),
                end: new Date(reservation.end_time).getHours(),
                room: reservation.classroom_id,
            }, 
            // Get Timeslot
            () => {
                this.setDateFromObject(this.state.chosen_date);
                let timeslot = helper.getTimeslotByTimes(this.state.start, this.state.end);
                this.setState({ timeslot: timeslot });
            }
            ))
            .catch(e => this.set_error({num:5, msg:"No Access"}))
    }

    // Sets the error to be shown
    set_error(error: Error):void{
        const maybe_error: immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({ ...this.state, errors: this.state.errors.push(error) })
            : null
    }

    public render() {
        return <div className="reservations">
        {
            this.state.id != 0 ?
            <div>
                <div className="page-header">
                    <h1>Edit Reservation {this.state.id}</h1>
                </div>
                <div>
                    {
                        this.state.errors.map((e,k) => {
                        return <div key={k} className="alert alert-danger" role="alert">
                                <p>{e.msg}</p>
                        </div>
                        })
                    }
                </div>
                    <div>
                        <p>Please enter the new data to update this reservation.</p>
                        <form>
                            <div className="row">
                                <label>Date:</label>
                                {
                                    this.state.date != 0 ?
                                    <DatePicker minDate={moment()} selected={this.state.chosen_date} onChange={this.handleDateChange}/>
                                    :
                                    ""
                                }
                            </div>

                            <div className="row">
                                <label>Timeslot:</label>
                            </div>
                            <div className="row">
                                <select name="timeslot" value={`${this.state.timeslot}`} onChange={this.handleChange}>
                                    <option value="0">Pick a time slot</option>
                                    <option value="1">9:00 - 11:00</option>
                                    <option value="2">11:00 - 13:00</option>
                                    <option value="3">13:00 - 15:00</option>
                                    <option value="4">15:00 - 17:00</option>
                                </select>
                            </div>

                            <br />

                            <div className="row">
                                <button type="button" name="create_classroom" className="btn btn-primary" onClick={this.verifyReservation}>Update Reservation</button>
                                <Link className="btn btn-secondary" to={'/reservation/overview'}>Cancel</Link>
                            </div>
                            <br />
                        </form>
                    </div>
                </div>
            :
            null
            }
        </div>
    }

}
