import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Location, Error } from '../Model' 
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

interface ClassroomEditState {
    id: 0 | number, 
    location: number | string,
    room: "" | string,
    public: false | boolean,
    available: false | boolean,
    locations: immutable.List<Location> | immutable.List<Location>,
    errors:immutable.List<Error>,
    auth:Auth,
}

export class ClassroomEdit extends React.Component<RouteComponentProps<{}>, ClassroomEditState> {
    constructor(props) {
        super(props);
        this.state = { 
            errors:immutable.List<Error>(),
            id: 0,
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
        this.getClassroom = this.getClassroom.bind(this);
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
            this.updateClassroom();
        } else {
            this.set_error({num:7, msg:"Please fill in the fields"});
        }
    }

    updateClassroom() {
        const values = this.state;
        api.updateClassroom(
            values.id,
            new Object({
                id: values.id,
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
        const { match: { params } } = this.props;
        var classroomId = Object.keys(params).map(function(key){return params[key]})[0];
        this.getLocations();
        this.getClassroom(classroomId);
    }
    
    getLocations(){
        api.getLocations()
        .then(locations => this.setState({locations:locations}))
        .catch(e => this.set_error({num:8, msg:"Locations Not Found"}))
    }

    getClassroom(classroomId){
        api.getClassroom(classroomId)
        .then(classroom => this.setState({
            id: classroom.id,
            available: classroom.is_disabled,
            public: classroom.is_public,
            location: classroom.location_id,
            room: classroom.name
        }))
        .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
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
                <h1>Edit classroom</h1>
            </div>
            <div>
                <div>
                    {
                        this.state.errors.map((e,k) => {
                        return <div key={k} className="alert alert-danger" role="alert">
                                <p>{e.msg}</p>
                        </div>
                        })
                    }
                </div>
                <p>Please enter the new data to update this classroom.</p>
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
                    <br/>
                    <div className="row">
                        <input type="checkbox" name="available" onChange={this.handleChange} checked={this.state.available} /> Disable the room
                    </div>    
                    <br />
                    <div className="row">
                        <button className="btn btn-primary" type="button" name="create_classroom" onClick={this.verifyClassroom}>Edit classroom</button>
                    </div>
                </form>

            </div>
        </div>;
    }

}
