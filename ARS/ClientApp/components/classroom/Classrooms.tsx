import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Reservation } from '../Model';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import * as immutable from 'immutable';
import { Location } from '../Model' 
import { Classroom } from '../Model' 
import 'react-datepicker/dist/react-datepicker.css';

interface ScheduleState { 
    location: 0, 
    classroom: String|0, 
    description: String|"",
    date_of_reservation: Date|0,
    chosen_date: Object,
    start: Number|0,
    end: Number|0,
    showSchedule:Boolean|false, 
    iframe:String|"",
    locations: immutable.List<Location> | immutable.List<Location>,
    available_classrooms: immutable.List<Classroom> | immutable.List<Classroom>
}

export class Classrooms extends React.Component<RouteComponentProps<{}>, ScheduleState> {
    constructor() {
        super();
        this.state = { 
            location: 0,
            classroom: 0,
            description: "",
            date_of_reservation: 0,
            chosen_date: moment(),
            start:0,
            end:0,
            showSchedule: false,
            iframe: "",
            locations: immutable.List<Location>(),
            available_classrooms: immutable.List<Classroom>()
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
        }, () => {
            //kalender tonen
            this.getClassrooms(this.state.location);
        });
        
    }

    handleDateChange(date) {
        this.setState({
          chosen_date: date
        }) 
        this.setDateFromObject(date);
    }

    verifyReservation(){
        const values = this.state;
        // refactor this to a re-usable function
        if(values.location != 0 && values.classroom != 0 && 
            values.description != "" && values.start != 0 && values.end != 0){
            if(values.date_of_reservation == 0){ 
                this.setState({ date_of_reservation: this.getFormattedDate(0) });
            }
            this.setReservation();
        } else {
            // show errors for the missing values
        }
    }

    componentWillMount(){
        this.getLocations();
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
        api.set_reservation(
            new Object({
                id: 0,
                classroom_id: values.classroom,
                date_of_reservation: values.date_of_reservation,
                start_time: this.getFormattedDate(values.start),
                end_time: this.getFormattedDate(values.end)
            })
        );
        window.location.replace('/reservation/overview');
    }

    getLocations(){
        api.getLocations()
        .then(locations => this.setState({ locations : locations }))
        .catch(e => console.log("getUsers, " + e))
    }

    getClassrooms(locationId){
        api.getLocationClassrooms(locationId)
        .then(classrooms => this.setState({ available_classrooms : classrooms }))
        .catch(e => console.log("getUsers, " + e))
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

    public render() {
        return <div>

            <div className="page-header">
                <h1>Classrooms overview</h1>
                <p>Please select a location and classroom.</p>
                <form>
                    <label>Location</label>
                    { 
                        this.state.locations ?
                            this.locationList()
                        :
                        null
                    }
                    <br/>
                    <label>Classroom</label>
                    { 
                        this.state.available_classrooms ?
                            this.classroomList()
                        :
                        null
                    }

                    <br/>

                    <label>Current room temp: 22</label> {/*todo: this should be updated after classroom+Location has been selected*/}
                    
                    <br/>

                    <label>Description:</label>
                    <textarea name="description" onChange={this.handleChange} value={`${this.state.description}`}></textarea>

                    <br/>

                    <label>Date:</label>
                    <DatePicker minDate={moment()} selected={this.state.chosen_date} onChange={this.handleDateChange}/>

                    <label>Start time:</label>
                    <select name="start" value={`${this.state.start}`} onChange={this.handleChange}>
                        <option value="0">Select a start time</option>
                        <option value="9">9:00</option>
                        <option value="10">10:00</option>
                        <option value="11">11:00</option>
                        <option value="12">12:00</option>
                    </select>
                    
                    <br/>

                    <label>End Time:</label>
                    <select name="end" value={`${this.state.end}`} onChange={this.handleChange}>
                        <option value="0">Select an end time</option>
                        <option value="13">13:00</option>
                        <option value="14">14:00</option>
                        <option value="15">15:00</option>
                        <option value="16">16:00</option>
                        <option value="17">17:00</option>
                    </select>

                    <br/>

                    <button type="button" name="make_reservation" onClick={this.verifyReservation}>Make a reservation</button>
                </form>

            </div>
           
        </div>;
    }

}
