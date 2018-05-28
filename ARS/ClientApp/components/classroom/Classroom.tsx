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
        return <tr>
            <th scope="row">{this.props.classroom.id}</th>
            <td>{this.props.classroom.name}</td>
            <td>{this.props.classroom.location_id}</td>
            <td>{this.props.classroom.is_public ? "Yes" : "No"}</td>
            <td>{this.props.classroom.is_disabled ? "No" : "Yes"}</td>
            <td><Link className="btn btn-primary" to={`/admin/classrooms/${this.props.classroom.id}/edit`}>Edit</Link></td>
            <td><button onClick={this.confirmDeletion.bind(this.props.classroom.id)} className="btn btn-primary">Delete</button></td>
        </tr>
    }

}
