import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Location, Error } from '../Model' 
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

interface ClassroomCreationState { 
    location: 0 | string,
    room: "" | string,
    public: false | boolean,
    available: false | boolean,
    locations: immutable.List<Location> | immutable.List<Location>,
    errors:immutable.List<Error>,
    auth:Auth,
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
            locations: immutable.List<Location>(),
            auth: {
                is_loggedin:false,
                user:null,
                permission:0
            }
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
        this.check_auth();
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => { this.setState({...this.state, auth:r})})
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }

    handle_auth(){
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        : this.state.auth.permission == 1 ?
            window.location.replace('/home')
        :
            this.handle_admin()
    }

    handle_admin(){
        this.setState({...this.state, errors:immutable.List<Error>()})
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

                    <div className="row">
                        <label>Location</label>
                    </div>
                    <div className="row">
                    { 
                        this.state.locations ?
                            this.locationList()
                        :
                        null
                        }
                    </div>
                    <br/>

                    <div className="row">
                        <label>Room</label>
                    </div>
                    <div className="row">
                        <input type="text" name="room" placeholder="Classroom name" value={`${this.state.room}`} onChange={this.handleChange} />
                    </div>
                    <br/>

                    <div className="row">
                        <input type="checkbox" name="public" onChange={this.handleChange} checked={this.state.public} /> Make the room public (this includes students)
                    </div>    
                    <br />
                    <div className="row">
                    <input type="checkbox" name="available" onChange={this.handleChange} checked={this.state.available} /> Disable the room
                    </div>
                    <br />
                    <div className="row">
                        <button className="btn btn-primary" type="button" name="create_classroom" onClick={this.verifyClassroom}>Create classroom</button>
                    </div>
                </form>

            </div>
        </div>;
    }

}
