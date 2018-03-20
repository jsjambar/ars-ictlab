import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Reservation } from '../Model';

interface TicketState { 
    location: String|0, 
    classroom: String|0,
    problem: String|0, 
    description: String|"",
    date: Number|0,
    time: Number|0,
    receiveCopy:Boolean|false
}

export class TicketForm extends React.Component<RouteComponentProps<{}>, TicketState> {
    constructor() {
        super();
        this.state = { 
            location: 0,
            classroom: 0,
            problem: 0,
            description: "",
            date:0,
            time:0,
            receiveCopy: false
        };
        // this.handleChange = this.handleChange.bind(this);
        // this.verifyReservation = this.verifyReservation.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
            [name] : value
        }, () => {
            const valid = this.verifyScheduleSelection();
        });
    }

    verifyScheduleSelection(){
        // const values = this.state;

        // if(values.location != 0 && values.classroom != 0){
        //     this.setState({
        //         showSchedule: true,
        //         iframe: "https://calendar.google.com/calendar/embed?src=" + this.state.classroom + "@hr.nl&ctz=Europe%2FAmsterdam"
        //     })
        // } else {
        //     this.setState({
        //         showSchedule: false
        //     })
        // }
    }

    // verifyReservation(){
    //     const values = this.state;
    //     // refactor this to a re-usable function
    //     if(values.location != 0 && values.classroom != 0 && 
    //         values.description != "" && values.start != 0 && values.end != 0){
    //         this.setReservation();
    //         console.log("aishdhdashdsuhdsu");
    //     } else {
    //         // show errors for the missing values
    //     }
    // }

    // setReservation() {
    //     const values = this.state;
    //     api.set_reservation(new Object({ date: "0000-00-00", start: values.start, end: values.end, classroom: values.classroom }));
    // }

    public render() {
        return <div>
            <div className="page-header">
                <h4>Ticket Form</h4>
            </div>
            <p>Please select a location and classroom.</p>
            <form>
                <label>Location</label>
                <select name='location' value={`${this.state.location}`} onChange={this.handleChange}>
                    <option value="0">Select a location</option>
                    <option value="1">Kralingse Zoom</option>
                    <option value="2">Kralingse Zoom</option>
                    <option value="3">Kralingse Zoom</option>
                    <option value="4">Kralingse Zoom</option>
                </select>
                <br/>
                <label>Classroom</label>
                <select name="classroom" value={`${this.state.classroom}`} onChange={this.handleChange}>
                    <option value="0">Select a classroom</option>
                    <option value="0907662">H.4.312</option>
                    <option value="0907662">H.4.312</option>
                    <option value="0907662">H.4.312</option>
                    <option value="0907662">H.4.312</option>
                </select>

                <br/>

                <label>Current room temp: 22</label> {/*todo: this should be updated after classroom+Location has been selected*/}
                
                <br/>

                <label>Description:</label>
                <textarea name="description" onChange={this.handleChange} value={`${this.state.description}`}></textarea>

                <br/>

                <label>Date:</label>
                <select name="date" value={`${this.state.date}`} onChange={this.handleChange}>
                    <option value="0">Select a date</option>
                    <option value="1">17-03-2018</option>
                    <option value="2">18-03-2018</option>
                    <option value="3">19-03-2018</option>
                </select>
                
                <br/>

                <label>Time:</label>
                <select name="time" value={`${this.state.time}`} onChange={this.handleChange}>
                    <option value="0">Select a time</option>
                    <option value="1">9:00</option>
                    <option value="2">10:00</option>
                    <option value="3">11:00</option>
                </select>

                <br/>

                <button type="button" name="submit_ticket">Submit ticket</button>
                <button type="button" name="cancel_ticket">Cancel</button>
            </form>
        </div>;
    }

}
