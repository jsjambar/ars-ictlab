import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Reservation, Location, Classroom, Timeslot, ClassroomWithEvents, Error } from '../Model';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import * as immutable from 'immutable';
import * as helper from '../Datehelper'; 
import BigCalendar from 'react-big-calendar';
import 'react-datepicker/dist/react-datepicker.css';
import "react-big-calendar/lib/css/react-big-calendar.css"

import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

interface ScheduleState { 
    location: 0, 
    classroom: String | 0,
    date_of_reservation: Date|0,
    chosen_date: Object,
    start: Number|0,
    end: Number|0,
    locations: immutable.List<Location> | immutable.List<Location>,
    available_classrooms: immutable.List<Classroom> | immutable.List<Classroom>,
    temp: Number,
    timeslot: Number,
    classroomsWithReservations: Array<ClassroomWithEvents>,
    auth:Auth,
    errors:immutable.List<Error>
}

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export class Classrooms extends React.Component<RouteComponentProps<{}>, ScheduleState> {
    constructor() {
        super();
        this.state = {
            errors:immutable.List<Error>(),
            location: 0,
            classroom: 0,
            date_of_reservation: new Date(),
            chosen_date: moment(),
            start:0,
            end:0,
            locations: immutable.List<Location>(),
            available_classrooms: immutable.List<Classroom>(),
            temp: -1,
            timeslot: 0,
            classroomsWithReservations: Array<ClassroomWithEvents>(),
            auth: {
                is_loggedin:false,
                user:null,
                permission:0
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.verifyReservation = this.verifyReservation.bind(this);
    }

    handleChange(event){
        const oldLoc = this.state.location;
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, 
        () => {
            if(this.state.location != oldLoc){
                this.getClassrooms(this.state.location);
            }
            this.setStartAndEnd(this.state.timeslot);
            if(this.state.classroom != 0){
                this.getClassroomsWithEvents(this.state.classroom);
                this.getClassroomTemperature(this.state.classroom);
            }
        });
    }

    handleDateChange(date) {
        this.setState({
            chosen_date: date
        })
        this.setDateFromObject(date);
    }

    verifyReservation() {
        const values = this.state;
        if(values.location != 0 && values.classroom != 0 && 
            values.start != 0 && values.end != 0){
            if(values.date_of_reservation == 0){ 
                this.setState({ date_of_reservation: this.getFormattedDate(0) });
            }
            this.setReservation();
        } else {
            this.set_error({num:7, msg:"Please fill in all the fields!"});
        }
    }

    setStartAndEnd(chosenTimeslot) {
        let processedDate = helper.getDateByTimeslot(chosenTimeslot);
        this.setState({
            start: processedDate.start,
            end: processedDate.end
        });
    }

    componentWillMount(){
        this.check_auth()
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => { this.setState({...this.state, auth:r})})
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }

    handle_auth(){
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        :this.state.auth.permission == 1 ?
            this.handle_user()
        : window.location.replace('/admin/classrooms/overview')
    }

    handle_user(){
        this.setState({...this.state, errors:immutable.List<Error>()})
        this.getLocations();
    }

    getFormattedDate(hour) {
        const date = new Date();
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour);
    }

    setDateFromObject(obj) {
        const self = this;
        Object.keys(obj).map(function (keyName, keyIndex) {
            if (keyName == '_d' && obj[keyName] !== null) {
                self.setState({
                    date_of_reservation: new Date(obj[keyName])
                })
            }
        });
    }

    setReservation() {
        const values = this.state;
        var res = api.set_reservation(
            new Object({
                classroom_id: values.classroom,
                user_id: this.state.auth.user.id,
                date_of_reservation: values.date_of_reservation,
                start_time: this.getFormattedDate(values.start),
                end_time: this.getFormattedDate(values.end)
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

    getLocations() {
        api.getLocations()
            .then(locations => this.setState({ locations: locations }))
            .catch(e => this.set_error({num:8, msg:"Locations Not Found"}))
    }

    getClassrooms(locationId) {
        api.getLocationClassrooms(locationId)
        .then(classrooms => this.setState({ classroom: 0, available_classrooms : classrooms}))
        .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
    }

    getClassroomsWithEvents(id) {
        api.getClassroomEvents(id)
            .then(events => this.setClassroomReservations(events))
            .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
    }

    setClassroomReservations(events){
        var arrReservations = [];
        events.forEach(element => {
            arrReservations.push(
                {
                    title: element.title,
                    start: new Date(element.start),
                    end: new Date(element.end)
                }
            )
        });

        this.setState({
            classroomsWithReservations: arrReservations
        })
    }

    getClassroomTemperature(id){
        api.getClassroomTemperature(id)
        .then(temp => this.setState({ temp: temp }, () => console.log(this.state)))
        .catch(e => this.set_error({num:9, msg:"Temperature could not be found."}))
    }

    locationList() {
        const listItems = this.state.locations.map((location) =>
            <option value={location.id}>
                {location.name}
            </option>
        );
        return (
            <select name='location' value={`${this.state.location}`} onChange={this.handleChange}>
                <option value="0">Select a location</option>
                {listItems}
            </select>
        );
    }

    classroomList() {
        const listItems = this.state.available_classrooms.map((classroom) =>
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

      timeslotList(){
        return (
        <select name='timeslot' value={`${this.state.timeslot}`} onChange={this.handleChange}>
            <option value="0">Select a timeslot</option>
            <option value="1">09:00 - 11:00</option>
            <option value="2">11:00 - 13:00</option>
            <option value="3">13:00 - 15:00</option>
            <option value="4">15:00 - 17:00</option>
        </select>
        );
      }

    public render() {
        return <div className="column schedules">

            <div className="page-header">
                <h1>Classrooms overview</h1>
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
                <p>Please select a location and classroom.</p>
                <form>
                    <div className="row">
                        <label>Location</label>
                    </div>
                    <div className="row">
                        { this.state.locations ? this.locationList() : null }
                    </div>

                    <br />
                    <div className="row">
                        <label>Classroom</label>
                    </div>
                    <div className="row">
                        { this.state.available_classrooms ? this.classroomList() : null }
                    </div>
                    <br />
                    <div className="row">
                        <label>
                            { this.state.temp > -1 ? "It's currently " + this.state.temp + " degrees in the classroom." : "" }
                        </label>
                    </div>
                    <br />
                    <div className="row">
                        <label>Date:</label>
                    </div>
                    <div className="row datePicker">
                        <DatePicker minDate={moment()} defaultDate={moment()} selected={this.state.chosen_date} onChange={this.handleDateChange}/>
                    </div>
                    <br />
                    <div className="row">
                        <label>Timeslot:</label>
                    </div>
                    <div className="row">
                        { this.timeslotList() }
                    </div>

                    <br />

                    <button type="button" className="btn btn-primary" name="make_reservation" onClick={this.verifyReservation}>Make a reservation</button>
                </form>
                { 
                        this.state.classroom != 0 ?
                        <BigCalendar 
                            views={Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])} 
                            events={this.state.classroomsWithReservations} 
                            timeslots={3}
                            step={60}
                            defaultDate={new Date()}
                            defaultView="month"
                            showMultiDayTimes 
                        />
                        :
                        null
                    }

            </div>
        </div>;
    }

}
