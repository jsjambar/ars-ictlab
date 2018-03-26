import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Reservation } from '../Model';

interface ScheduleState { 
    location: String|0, 
    classroom: String|0, 
    description: String|"",
    start: Number|0,
    end: Number|0,
    showSchedule:Boolean|false, 
    iframe:String|"" 
}

export class Classrooms extends React.Component<RouteComponentProps<{}>, ScheduleState> {
    constructor() {
        super();
        this.state = { 
            location: 0,
            classroom: 0,
            description: "",
            start:0,
            end:0,
            showSchedule: false,
            iframe: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.verifyReservation = this.verifyReservation.bind(this);
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
        const values = this.state;

        if(values.location != 0 && values.classroom != 0){
            this.setState({
                showSchedule: true,
                iframe: "https://calendar.google.com/calendar/embed?src=" + this.state.classroom + "@hr.nl&ctz=Europe%2FAmsterdam"
            })
        } else {
            this.setState({
                showSchedule: false
            })
        }
    }

    verifyReservation(){
        const values = this.state;
        // refactor this to a re-usable function
        if(values.location != 0 && values.classroom != 0 && 
            values.description != "" && values.start != 0 && values.end != 0){
            this.setReservation();
        } else {
            // show errors for the missing values
        }
    }

    setReservation() {
        const values = this.state;
        const date = new Date();
        api.set_reservation(
            new Object({
                id: 0,
                classroom_id: values.classroom,
                created_at: date,
                start: values.start,
                end: values.end
            })
        );
    }

    public render() {
        return <div>

            <div className="page-header">
                <h1>Classrooms overview</h1>
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

                    <label>Start time:</label>
                    <select name="start" value={`${this.state.start}`} onChange={this.handleChange}>
                        <option value="0">Select a start time</option>
                        <option value="1">9:00</option>
                        <option value="2">10:00</option>
                        <option value="3">11:00</option>
                    </select>
                    
                    <br/>

                    <label>End Time:</label>
                    <select name="end" value={`${this.state.end}`} onChange={this.handleChange}>
                        <option value="0">Select an end time</option>
                        <option value="1">9:00</option>
                        <option value="2">10:00</option>
                        <option value="3">11:00</option>
                    </select>

                    <br/>

                    <button type="button" name="make_reservation" onClick={this.verifyReservation}>Make a reservation</button>
                </form>

            </div>

            {
                this.state.showSchedule ?
                <div>
                    <iframe src={`${this.state.iframe}`} width='100%' height='650' scrolling='no' frameBorder='0'></iframe>
                </div>
                :
                ""
            }

        </div>;
    }

}
