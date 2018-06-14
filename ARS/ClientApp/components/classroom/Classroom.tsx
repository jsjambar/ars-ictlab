import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom'
import { Classroom, Location } from '../Model'
import * as api from '../Api';

export type classroomComponentProps = { classroom: Classroom, key: number }

// State that gets used
interface ClassroomState {
    location: Location
}

export class ClassroomComponent extends React.Component<classroomComponentProps, ClassroomState> {
    constructor() {
        super();
        this.state = {
            location: {
                id: 0,
                name: ""
            }
        };
    }

    componentWillMount(): void {
        this.getLocation();
    }

    // Start getting the Location where the Classroom is located
    // This is needed for showing the name of the Location
    getLocation(): void {
        api.getLocation(this.props.classroom.location_id)
            .then(location => { this.setState({ location: location}) })
            .catch(e => {
                var tempLocation = this.state.location;
                tempLocation.name = "Not Found";
                this.setState({ location: tempLocation })
            })
    }

    confirmDeletion(){
        var wantsToDelete = window.confirm("Are you sure you want to delete this classroom?");
        if(wantsToDelete){
            var classroomId = this;
            api.deleteClassroom(classroomId).then(function(deleted){
                if(deleted){
                    location.reload();
                }
            });
        }
    }

    public render() {
        return <div className="row">
            <strong className="col-xs-1 first" scope="row">{this.props.classroom.id}</strong>
            <div className="col-xs-2">{this.props.classroom.name}</div>
            <div className="col-xs-2">{this.state.location.name}</div>
            <div className="col-xs-2">{this.props.classroom.is_public ? "Yes" : "No"}</div>
            <div className="col-xs-2">{this.props.classroom.is_disabled ? "No" : "Yes"}</div>
            <div className="col-xs-3 last">
                <Link className="btn btn-primary" to={`/admin/classrooms/${this.props.classroom.id}/edit`}>Edit</Link>
                <button onClick={this.confirmDeletion.bind(this.props.classroom.id)} className="btn btn-danger btn-last">Delete</button>
            </div>
        </div>
    }

}
