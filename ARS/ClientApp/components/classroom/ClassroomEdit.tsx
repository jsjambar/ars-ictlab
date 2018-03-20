import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Location } from '../Model' 

interface ClassroomEditState {
    id: 0 | number, 
    location: 0 | string,
    room: "" | string,
    start: 0 | number,
    end: 0 | number,
    public: false | boolean,
    available: false | boolean,
    locations: immutable.List<Location> | immutable.List<Location>
}

const ClassroomId = ({ match }) => (
    console.log(match.params.id)
)

export class ClassroomEdit extends React.Component<RouteComponentProps<{}>, ClassroomEditState> {
    constructor(props) {
        super(props);
        this.state = { 
            id: 0,
            location: 0,
            room: "",
            start: 0,
            end: 0,
            public: false,
            available: false,
            locations: immutable.List<Location>()
        };

        this.handleChange = this.handleChange.bind(this);
        this.verifyClassroom = this.verifyClassroom.bind(this);
        this.getClassroom = this.getClassroom.bind(this);
    }

    getDate(hour){
        const date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour);
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
            this.updateClassroom();
        } else {
            console.log("Not valid.");
            // show errors for the missing values
        }
    }

    updateClassroom() {
        const values = this.state;
        api.updateClassroom(
            new Object({
                ClassroomId: values.id,
                LocationId: values.location,
                Name: values.room,
                StartTime: this.getDate(values.start), 
                EndTime: this.getDate(values.end),
                IsPublic: values.public,
                IsDisabled: values.available
            }), values.id
        );
        //redirect or something id undno
    }

    componentWillMount(){
        this.getLocations();
        this.getClassroom();
    }

    getLocations(){
        api.getLocations()
        .then(locations => this.setState({locations:locations}))
        .catch(e => console.log("getUsers, " + e))
    }

    getClassroom(){
        api.getClassroom(4)
        .then(classroom => console.log(classroom))
        .catch(e => console.log("getUsers, " + e))
    }

    locationList() {
        const listItems = this.state.locations.map((location) =>
          <option value={location.locationId}>
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

    public render() {
        return <div>

            <div className="page-header">
                <h1>Edit classroom</h1>
                <p>Please enter the new data to update this classroom.</p>
                <form>
                    <label>Location</label>
                    { 
                        this.state.locations ?
                            this.locationList()
                        :
                        null
                    }
                    <br/>

                    <label>Room</label>
                    <input type="text" name="room" placeholder="Classroom name" value={`${this.state.room}`} onChange={this.handleChange} />
                    <br/>

                    <label>Reservation time start:</label>
                    <select name="start" value={`${this.state.start}`} onChange={this.handleChange}>
                        <option value="0">Select a start time</option>
                        <option value="9">9:00</option>
                        <option value="10">10:00</option>
                        <option value="11">11:00</option>
                        <option value="12">12:00</option>
                    </select>
                    <br/>

                    <label>Reservation time end:</label>
                    <select name="end" value={`${this.state.end}`} onChange={this.handleChange}>
                        <option value="0">Select an end time</option>
                        <option value="13">13:00</option>
                        <option value="14">14:00</option>
                        <option value="15">15:00</option>
                        <option value="16">16:00</option>
                        <option value="17">17:00</option>
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
