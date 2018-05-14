import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import { Reservation } from '../Model';

interface ScheduleState {
    location: String | 0,
    classroom: String | 0,
    description: String | "",
    start: Number | 0,
    end: Number | 0,
    showSchedule: Boolean | false,
    iframe: String | ""
}

export class Classrooms extends React.Component<RouteComponentProps<{}>, ScheduleState> {
    constructor() {
        super();
        this.state = {
            location: 0,
            classroom: 0,
            description: "",
            start: 0,
            end: 0,
            showSchedule: false,
            iframe: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.verifyReservation = this.verifyReservation.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => {
            const valid = this.verifyScheduleSelection();
        });
    }

    verifyScheduleSelection() {
        const values = this.state;

        if (values.location != 0 && values.classroom != 0) {
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

    verifyReservation() {
        const values = this.state;
        // refactor this to a re-usable function
        if (values.location != 0 && values.classroom != 0 &&
            values.description != "" && values.start != 0 && values.end != 0) {
            this.setReservation();
        } else {
            // show errors for the missing values
        }
    }

    getDate(hour) {
        const date = new Date();
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour);
    }

    setReservation() {
        const values = this.state;
        const date = new Date();
        date.setHours(date.getUTCHours() + 2);
        api.set_reservation(
            new Object({
                id: 0,
                classroom_id: values.classroom,
                created_at: date,
                start_time: this.getDate(values.start),
                end_time: this.getDate(values.end)
            })
        );
        window.location.replace('/reservation/overview');
    }

    public render() {
        return <div className="column schedules">

            <div className="page-header">
                <h1>Classrooms overview</h1>
            </div>
            <div>
                <p>Please select a location and classroom.</p>
                <form>
                    <div className="row">
                        <label>Location:</label>
                    </div>
                    <div className="row">
                        <select name='location' value={`${this.state.location}`} onChange={this.handleChange}>
                            <option value="0">Select a location</option>
                            <option value="1">Kralingse Zoom</option>
                            <option value="2">Kralingse Zoom</option>
                            <option value="3">Kralingse Zoom</option>
                            <option value="4">Kralingse Zoom</option>
                        </select>
                    </div>
                    <div className="row">
                        <label>Classroom:</label>
                    </div>
                    <div className="row">
                        <select name="classroom" value={`${this.state.classroom}`} onChange={this.handleChange}>
                            <option value="0">Select a classroom</option>
                            <option value="0907662">H.4.312</option>
                            <option value="0907662">H.4.312</option>
                            <option value="0907662">H.4.312</option>
                            <option value="0907662">H.4.312</option>
                        </select>
                    </div>

                    <div className="row">
                        <label>Current room temp:</label> 22 {/*todo: this should be updated after classroom+Location has been selected*/}
                    </div>

                    <div className="row">
                        <label>Description:</label>
                    </div>
                    <div className="row">
                        <textarea className="description" name="description" onChange={this.handleChange} value={`${this.state.description}`}></textarea>
                    </div>

                    <div className="row">
                        <label>Start time:</label>
                    </div>
                    <div className="row">
                        <select name="start" value={`${this.state.start}`} onChange={this.handleChange}>
                            <option value="0">Select a start time</option>
                            <option value="9">9:00</option>
                            <option value="10">10:00</option>
                            <option value="11">11:00</option>
                            <option value="12">12:00</option>
                        </select>
                    </div>

                    <div className="row">
                        <label>End Time:</label>
                    </div>
                    <div className="row">
                        <select name="end" value={`${this.state.end}`} onChange={this.handleChange}>
                            <option value="0">Select an end time</option>
                            <option value="13">13:00</option>
                            <option value="14">14:00</option>
                            <option value="15">15:00</option>
                            <option value="16">16:00</option>
                            <option value="17">17:00</option>
                        </select>
                    </div>

                    <br />
                    <button type="button" className="btn btn-primary" name="make_reservation" onClick={this.verifyReservation}>Make a reservation</button>
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
