import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import * as immutable from 'immutable';
import { Classroom, Error } from '../Model'
import * as helper from '../Datehelper'; 
import 'react-datepicker/dist/react-datepicker.css';
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

interface ReservationForClassroomSchedule {
    classroom: 0,
    date_of_reservation: Date|0,
    chosen_date: Object,
    start: Number|0,
    end: Number|0,
    available_classrooms: immutable.List<Classroom> | immutable.List<Classroom>,
    temp: Number,
    auth:Auth
    timeslot: Number,
    errors:immutable.List<Error>
}

export class ReservationForClassroom extends React.Component<RouteComponentProps<{}>, ReservationForClassroomSchedule> {
    constructor() {
        super();
        this.state = {
            classroom: 0,
            date_of_reservation: 0,
            chosen_date: moment(),
            start:0,
            end:0,
            available_classrooms: immutable.List<Classroom>(),
            temp: 0,
            timeslot: 0,
            auth: { 
                is_loggedin: false,
                user: null,
                permission: 0
            },
            errors:immutable.List<Error>()
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.verifyReservation = this.verifyReservation.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
            [name] : value
        }, 
        () => this.setStartAndEnd(this.state.timeslot)
        );
    }

    handleDateChange(date) {
        this.setState({
          chosen_date: date
        }) 
        this.setDateFromObject(date);
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => { this.setState({...this.state, auth:r}) })
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }

    handle_auth(){
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        : 
        this.state.auth.permission == 1 ?
            this.handle_user()
        : window.location.replace('/admin/classrooms/overview')
    }

    handle_user(){
        this.setState({...this.state, errors:immutable.List<Error>()})
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    verifyReservation(){
        const values = this.state;
        // refactor this to a re-usable function
        if(values.classroom != 0 && values.start != 0 && values.end != 0){
            if(values.date_of_reservation == 0){ 
                this.setState({ date_of_reservation: this.getFormattedDate(0) });
            }
            this.setReservation();
        }
    }

    setStartAndEnd(chosenTimeslot){
        let processedDate = helper.getDateByTimeslot(chosenTimeslot);
        this.setState({
            start: processedDate.start,
            end: processedDate.end
        });
    }

    componentWillMount(){
        this.check_auth();

        const { match: { params } } = this.props;
        var classroomId = Object.keys(params).map(function(key){return params[key]})[0];

        this.setState({
            classroom: classroomId
        }, () => this.getClassroomTemperature(this.state.classroom));
    }

    getClassroomTemperature(id){
        api.getClassroomTemperature(id)
        .then(temp => this.setState({ temp: temp }))
        .catch(e => this.set_error({num:9, msg:"Temperature could not be found."}))
    }
   
    getFormattedDate(hour) {
        const date = new Date();
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour);
    }

    setDateFromObject(obj){
        const self = this;
        Object.keys(obj).map(function(keyName, keyIndex) {
            if(keyName == '_d' && obj[keyName] !== null){
                self.setState({
                    date_of_reservation: new Date(obj[keyName])
                })
            }
        });
    }

    
    setReservation() {
        const values = this.state;
        const self = this;

        var res = api.set_reservation(
            new Object({
                classroom_id: values.classroom,
                user_id: this.state.auth.user.id,
                date_of_reservation: values.date_of_reservation,
                start_time: this.getFormattedDate(values.start),
                end_time: this.getFormattedDate(values.end)
            })
        );

        res.then(function(response){
            if(response.error == 1){
                self.set_error({num:6, msg:"Timeslot already taken"});
            } else {
                window.location.replace('/reservation/overview');
            }
        })
    }

    public render() {
        return <div>

            <div className="page-header">
                <h1>Make a reservation</h1>
                <p>Please select a date and time.</p>
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
                <form>
                    <div className="row">
                        <label>
                            { this.state.temp > -1 ? "It's currently " + this.state.temp + " degrees in the classroom." : "" }
                        </label>
                    </div>

                    <br/>

                    <div className="row">
                        <label>Date:</label>
                    </div>
                    <div className="row datePicker">
                        <DatePicker minDate={moment()} defaultDate={moment()} selected={this.state.chosen_date} onChange={this.handleDateChange} />
                    </div>

                    <br/>

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


                    <br/>

                    <div className="row">
                        <button className="btn btn-primary" type="button" name="make_reservation" onClick={this.verifyReservation}>Make a reservation</button>
                    </div>
                </form>

            </div>
           
        </div>;
    }

}
