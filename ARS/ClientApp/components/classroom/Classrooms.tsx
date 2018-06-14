// Imports 
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Location, Classroom, ClassroomWithEvents, Error } from '../Model';
import * as api from '../Api';

// Helpers
import * as moment from 'moment';
import * as immutable from 'immutable';
import * as helper from '../Datehelper'; 

// Calendar
import BigCalendar from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css"

// Datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Authentication
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

// State that gets used
interface ScheduleState { 
    location: 0, 
    classroom: 0,
    date_of_reservation: Date | 0,
    chosen_date: Object,
    start: Number,
    end: Number,
    locations: immutable.List<Location>,
    available_classrooms: immutable.List<Classroom>,
    temp: Number,
    timeslot: Number,
    classroomsWithReservations: Array<ClassroomWithEvents>,
    auth:Auth,
    errors:immutable.List<Error>
}

// Localizer to show our date
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

export class Classrooms extends React.Component<RouteComponentProps<{}>, ScheduleState> {
    constructor() {
        super();
        // Default values
        this.state = {
            location: 0,
            classroom: 0,
            start:0,
            end:0,
            timeslot: 0,
            date_of_reservation: new Date(),
            chosen_date: moment(),
            locations: immutable.List<Location>(),
            available_classrooms: immutable.List<Classroom>(),
            temp: -1, // -1 because we currently return 0 as we don't have the database live and it checks whether its bigger than -1
            classroomsWithReservations: Array<ClassroomWithEvents>(),
            errors:immutable.List<Error>(),

            // Authentication
            auth: { 
                is_loggedin: false,
                user: null,
                permission: 0
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.verifyReservation = this.verifyReservation.bind(this);
    }

    // Begin authentication and getting the startup data
    componentWillMount() : void{
        this.check_auth()
    }

    check_auth() : void {
        Authentication.check_auth()
        .then(r => { this.setState({...this.state, auth:r}) })
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }

    handle_auth() : void {
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        : 
        this.state.auth.permission == 1 ?
            this.handle_user()
        : window.location.replace('/admin/classrooms/overview')
    }

    handle_user() : void {
        this.setState({...this.state, errors:immutable.List<Error>()})
        this.getLocations();
    }
    // End authentication and getting the startup data

    // Handle change of values
    handleChange(event) : void {
        const oldLoc = this.state.location;
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, 
        () => {
            // If it isn't the same classroom, don't refresh it (fixes calendar bug)
            if(this.state.location != oldLoc){
                this.getClassrooms(this.state.location);
            }

            this.setStartAndEnd(this.state.timeslot);
            
            // Get events and temperature of the selected classroom
            if(this.state.classroom != 0){
                this.getClassroomsWithEvents(this.state.classroom);
                this.getClassroomTemperature(this.state.classroom);
            }
        });
    }

    // Unique date onchange method to format the date from the datepicker object
    handleDateChange(date) : void {
        this.setState({
            chosen_date: date
        })

        this.setDateFromObject(date);
    }

    // Checks if values are valid and then save the reservation
    verifyReservation() : void {
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

    // Set the start and end time because we process it in terms of timeslots and save it as start and end time
    setStartAndEnd(chosenTimeslot) : void {
        let processedDate = helper.getDateByTimeslot(chosenTimeslot);
        this.setState({
            start: processedDate.start,
            end: processedDate.end
        });
    }


    // Formats the date and adds the unique hour we need
    getFormattedDate(hour) : Date {
        const date = new Date();
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour);
    }

    // Gets the date from the datepicker object
    setDateFromObject(obj) : void {
        const self = this;
        Object.keys(obj).map(function (keyName, keyIndex) {
            if (keyName == '_d' && obj[keyName] !== null) {
                self.setState({
                    date_of_reservation: new Date(obj[keyName])
                })
            }
        });
    }

    // Saves the reservation
    setReservation() : void {
        var self = this;
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
        
        // After the reservation gets saved, we see what response it returns.
        res.then(function(response){
            if(response.error == 1){
                self.set_error({num:6, msg:"Timeslot already taken"});
            } else {
                window.location.replace('/reservation/overview');
            }
        })
    }

    // Sets the error to be shown
    set_error(error:Error) : void {
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    // Start getting the locations/classrooms/events/temperature that needs to be shown
    getLocations() : void {
        api.getLocations()
            .then(locations => this.setState({ locations: locations }))
            .catch(e => this.set_error({num:8, msg:"Locations Not Found"}))
    }

    getClassrooms(locationId) : void {
        api.getLocationClassrooms(locationId)
        .then(classrooms => this.setState({ classroom: 0, available_classrooms: classrooms}))
        .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
    }

    getClassroomsWithEvents(id) : void {
        api.getClassroomEvents(id)
            .then(events => this.setClassroomReservations(events))
            .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
    }
    
    getClassroomTemperature(id) : void{
        api.getClassroomTemperature(id)
        .then(temp => this.setState({ temp: temp }))
        .catch(e => this.set_error({num:9, msg:"Temperature could not be found."}))
    }
    // End getting the location of locations/classrooms/events/temperature that needs to be shown

    // Format the reservations to be able to be used in the calendar package
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

    // Start the rendering methods
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

      // End the rendering methods

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

                    <br />
                    <br />
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
