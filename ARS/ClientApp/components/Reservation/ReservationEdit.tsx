import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Location, Classroom, Error } from '../Model'
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import * as helper from '../Datehelper';
import 'react-datepicker/dist/react-datepicker.css';
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication';

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

    getDate(hour) {
        const date = new Date();
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name] : value
        }, () => this.setStartAndEnd(this.state.timeslot));
    }

    handleDateChange(date) {
        this.setState({
          chosen_date: date
        }) 
        this.setDateFromObject(date);
    }

    setStartAndEnd(chosenTimeslot){
        let processedDate = helper.getDateByTimeslot(chosenTimeslot);

        this.setState({
            start: processedDate.start,
            end: processedDate.end
        });
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

    verifyReservation() {
        const values = this.state;
        // refactor this to a re-usable function
        if (values.room != 0 && values.start != 0 && values.end != 0) {
            this.updateReservation();
        } else {
            this.set_error({num:7, msg:"Please fill in the fields"});
        }
    }

    updateReservation() {
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
        res.then(function(response){
            if(response.error == 1){
                pass = false;
            } else {
                window.location.replace('/reservation/overview');
            }
        })

        if(!pass){
            this.set_error({num:6, msg:"Timeslot already taken"});
        }
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    componentWillMount() {
        this.check_auth();
    }

    getReservation(reservationId) {
        api.getReservation(reservationId)
            .then(reservation => this.setState({
                id: reservation.id,
                chosen_date: moment(reservation.date_of_reservation).hour(10),
                start: new Date(reservation.start_time).getHours(),
                end: new Date(reservation.end_time).getHours(),
                room: reservation.classroom_id,
            }, 
            () => {
                this.setDateFromObject(this.state.chosen_date);
                let timeslot = helper.getTimeslotByTimes(this.state.start, this.state.end);
                this.setState({ timeslot: timeslot });
            }
            ))
            .catch(e => this.set_error({num:5, msg:"No Access"}))
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => this.setState({...this.state, auth:r}))
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }
 
    handle_auth(){
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        :this.state.auth.permission == 2 ?
            window.location.replace('/admin/classrooms/overview')
        : this.handle_user()
    }

    handle_user(){
        this.setState({...this.state, errors:immutable.List<Error>()})
        const { match: { params } } = this.props;
        var reservationId = Object.keys(params).map(function (key) { return params[key] })[0];
        this.getReservation(reservationId);
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
                        this.state.errors.map(e => {
                        return <div className="alert alert-danger" role="alert">
                                <p>{e.msg}</p>
                        </div>
                        })
                    }
                </div>
            
                <div>
                     <div className="page-header">
                        <h1>Edit Reservation {this.state.id}</h1>
                    </div>

                    <br/>

                    <div className="row datePicker">
                        <label>Date:</label>

                        {
                            this.state.errors.map(e => {
                            return <div className="alert alert-danger" role="alert">
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
                        </form>
                    </div>
                </div>
            </div>
            :
            null
            }
        </div>
    }

}
