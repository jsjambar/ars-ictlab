import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Location } from '../Model' 

interface ClassroomCreationState { 
    location: 0 | String,
    room: "" | String,
    start: 0 | String,
    end: 0 | String,
    public: false | Boolean,
    available: false | Boolean,
    locations: "" | immutable.List<Location>
}

export class ClassroomCreation extends React.Component<RouteComponentProps<{}>, ClassroomCreationState> {
    constructor() {
        super();
        this.state = { 
            location: 0,
            room: "",
            start: 0,
            end: 0,
            public: false,
            available: false,
            locations: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.verifyClassroom = this.verifyClassroom.bind(this);
    }

    handleChange(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
            [name] : value
        });
    }

    verifyClassroom(){
        const values = this.state;
        // refactor this to a re-usable function
        if(values.location != 0 && values.room != "" && 
            values.start != 0 && values.end != 0){
            this.createClassroom();
        } else {
            console.log("Not valid.");
            // show errors for the missing values
        }
    }

    createClassroom() {
        const values = this.state;
        api.createClassroom(
            new Object({
                location_id: values.location,
                name: values.room,
                start: new Date(), 
                end: new Date(),
                is_public: values.public,
                available: values.available
            })
        );
        //redirect or something id undno
    }

    componentWillMount(){
        this.getLocations();
    }

    getLocations(){
        api.getLocations()
        .then(locations => this.setState({locations:locations}))
        .catch(e => console.log("getUsers, " + e))
    }

    public render() {
        return <div>

            <div className="page-header">
                <h1>Create a classroom</h1>
                <p>Please enter the data to create a classroom.</p>
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

                    <label>Room</label>
                    <input type="text" name="room" placeholder="Classroom name" value={`${this.state.room}`} onChange={this.handleChange} />
                    <br/>

                    <label>Reservation time start:</label>
                    <select name="start" value={`${this.state.start}`} onChange={this.handleChange}>
                        <option value="0">Select a start time</option>
                        <option value="1">9:00</option>
                        <option value="2">10:00</option>
                        <option value="3">11:00</option>
                    </select>
                    <br/>

                    <label>Reservation time end:</label>
                    <select name="end" value={`${this.state.end}`} onChange={this.handleChange}>
                        <option value="0">Select an end time</option>
                        <option value="1">9:00</option>
                        <option value="2">10:00</option>
                        <option value="3">11:00</option>
                    </select>
                    <br/>

                    <input type="checkbox" name="public"/> Make the room public (this includes students)
                    <br/>
                    <input type="checkbox" name="available"/> Disable the room
                    <br/>
                    <button type="button" name="create_classroom" onClick={this.verifyClassroom}>Create classroom</button>
                </form>

            </div>
        </div>;
    }

}
