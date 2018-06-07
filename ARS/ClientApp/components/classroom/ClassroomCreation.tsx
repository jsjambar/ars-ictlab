import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Location, Error } from '../Model' 

interface ClassroomCreationState { 
    location: 0 | string,
    room: "" | string,
    public: false | boolean,
    available: false | boolean,
    locations: immutable.List<Location> | immutable.List<Location>,
    errors:immutable.List<Error>
}

export class ClassroomCreation extends React.Component<RouteComponentProps<{}>, ClassroomCreationState> {
    constructor() {
        super();
        this.state = { 
            errors:immutable.List<Error>(),
            location: 0,
            room: "",
            public: false,
            available: false,
            locations: immutable.List<Location>()
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

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    verifyClassroom(){
        const values = this.state;
        // refactor this to a re-usable function
        if(values.location != 0 && values.room != ""){
            this.createClassroom();
        } else {
            this.set_error({num:7, msg:"Please fill in the fields"});
        }
    }

    createClassroom() {
        const values = this.state;
        api.createClassroom(
            new Object({
                id: 0,
                location_id: values.location,
                name: values.room,
                is_public: values.public,
                is_disabled: values.available
            })
        );
        window.location.replace('/admin/classrooms/overview');
    }

    componentWillMount(){
        this.getLocations();
    }

    getLocations(){
        api.getLocations()
        .then(locations => this.setState({locations:locations}))
        .catch(e => this.set_error({num:8, msg:"Locations Not Found"}))
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

    public render() {
        return <div>

            <div className="page-header">
                <h1>Create a classroom</h1>
                <div>
                    {
                        this.state.errors.map(e => {
                        return <div className="alert alert-danger" role="alert">
                                <p>{e.msg}</p>
                        </div>
                        })
                    }
                </div>
                <p>Please enter the data to create a classroom.</p>
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

                    <input type="checkbox" name="public" onChange={this.handleChange} checked={this.state.public} /> Make the room public (this includes students)
                    <br/>
                    <input type="checkbox" name="available" onChange={this.handleChange} checked={this.state.available} /> Disable the room
                    <br/>
                    <button type="button" name="create_classroom" onClick={this.verifyClassroom}>Create classroom</button>
                </form>

            </div>
        </div>;
    }

}
