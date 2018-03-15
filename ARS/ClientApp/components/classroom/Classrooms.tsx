import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface ScheduleState { location: String|0, classroom: String|0, showSchedule:Boolean|false, iframe:String|"" }

export class Classrooms extends React.Component<RouteComponentProps<{}>, ScheduleState> {
    constructor() {
        super();
        this.state = { 
            location: 0,
            classroom: 0,
            showSchedule: false,
            iframe: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
            [name] : value
        }, () => {
            const valid = this.validateValues();
        });
    }

    validateValues(){
        const values = this.state;

        if(values.location != 0 && values.classroom != 0){
            this.setState({
                showSchedule: true,
                iframe: "https://calendar.google.com/calendar/embed?src=" + this.state.classroom + "@hr.nl&ctz=Europe%2FAmsterdam"
            })
        } else {
            this.setState({
                showSchedule: false,
                iframe: ""
            })
        }
    }

    public render() {
        return <div>

            <div className="page-header">
                <h1>Classrooms overview</h1>
                <p>Please select a location and classroom.</p>

                <label>Location</label>
                <select name='location' value={`${this.state.location}`} onChange={this.handleChange}>
                    <option value="0">Select a location</option>
                    <option value="1">Kralingse Zoom</option>
                    <option value="2">Kralingse Zoom</option>
                    <option value="3">Kralingse Zoom</option>
                    <option value="4">Kralingse Zoom</option>
                </select>
                
                <label>Classroom</label>
                <select name="classroom" value={`${this.state.classroom}`} onChange={this.handleChange}>
                    <option value="0">Select a classroom</option>
                    <option value="0907662">H.4.312</option>
                    <option value="0907662">H.4.312</option>
                    <option value="0907662">H.4.312</option>
                    <option value="0907662">H.4.312</option>
                    H.4.
                </select>
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
