import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Reservation } from '../Model';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
import * as immutable from 'immutable';
import { Location } from '../Model' 
import { Classroom } from '../Model'
import * as helper from '../Datehelper'; 
import 'react-datepicker/dist/react-datepicker.css';

interface ReservationForClassroomSchedule {
    classroom: 0,
    description: String|"",
    date_of_reservation: Date|0,
    chosen_date: Object,
    start: Number|0,
    end: Number|0,
    available_classrooms: immutable.List<Classroom> | immutable.List<Classroom>,
    temp: Number,
    timeslot: Number
}

export class ReservationForClassroom extends React.Component<RouteComponentProps<{}>, ReservationForClassroomSchedule> {
    constructor() {
        super();

        this.state = {
            classroom: 0,
            description: "",
            date_of_reservation: 0,
            chosen_date: moment(),
            start:0,
            end:0,
            available_classrooms: immutable.List<Classroom>(),
            temp: 0,
            timeslot: 0
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
        }, () => this.setStartAndEnd(this.state.timeslot)
        );
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
        if(values.classroom != 0 && values.description != "" && values.start != 0 && values.end != 0){
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
        const { match: { params } } = this.props;
        var classroomId = Object.keys(params).map(function(key){return params[key]})[0];

        this.setState({
            classroom: classroomId
        });
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

    getClassrooms(classroomId){

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
                <h1>Make a reservation</h1>
                <p>Please select a date and time.</p>
                <form>
                    <label>
                        It's currently { this.state.temp ? this.state.temp : "invalid temperature" } degrees in the classroom.
                    </label> {/*todo: this should be updated after classroom+Location has been selected*/}
                    
                    <br/>

                    <label>Description:</label>
                    <textarea name="description" onChange={this.handleChange} value={`${this.state.description}`}></textarea>

                    <br/>

                    <label>Date:</label>
                    <DatePicker minDate={moment()} selected={this.state.chosen_date} onChange={this.handleDateChange}/>

                    <label>Timeslot:</label>
                    <select name="timeslot" value={`${this.state.timeslot}`} onChange={this.handleChange}>
                        <option value="0">Pick a time slot</option>
                        <option value="1">9:00 - 11:00</option>
                        <option value="2">11:00 - 13:00</option>
                        <option value="3">13:00 - 15:00</option>
                        <option value="4">15:00 - 17:00</option>
                    </select>

                    <br/>

                    <button type="button" name="make_reservation" onClick={this.verifyReservation}>Make a reservation</button>
                </form>

            </div>
           
        </div>;
    }

}
