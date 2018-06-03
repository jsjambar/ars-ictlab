import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom'
import { Classroom } from '../Model'
import * as api from '../Api';

export type classroomComponentProps = { classroom: Classroom, key: number }

export class ClassroomComponent extends React.Component<classroomComponentProps, {}> {
    constructor() {
        super();
        this.state = {};
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
            <div className="col-xs-2">{this.props.classroom.location_id}</div>
            <div className="col-xs-2">{this.props.classroom.is_public ? "Yes" : "No"}</div>
            <div className="col-xs-2">{this.props.classroom.is_disabled ? "No" : "Yes"}</div>
            <div className="col-xs-3 last">
                <Link className="btn btn-primary" to={`/admin/classrooms/${this.props.classroom.id}/edit`}>Edit</Link>
                <button onClick={this.confirmDeletion.bind(this.props.classroom.id)} className="btn btn-danger btn-last">Delete</button>
            </div>
        </div>
    }

}
