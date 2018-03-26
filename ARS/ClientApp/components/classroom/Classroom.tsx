import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom'
import { Classroom } from '../Model'

export type classroomComponentProps = { classroom: Classroom, key: number }

export class ClassroomComponent extends React.Component<classroomComponentProps, {}> {
    constructor() {
        super();
        this.state = {};
    }

    public render() {
        return <tr>
            <th scope="row">{this.props.classroom.id}</th>
            <td>{this.props.classroom.name}</td>
            <td>{this.props.classroom.location_id}</td>
            <td>{this.props.classroom.start_time}</td>
            <td>{this.props.classroom.end_time}</td>
            <td>{this.props.classroom.is_public ? "Yes" : "No"}</td>
            <td>{this.props.classroom.is_disabled ? "No" : "Yes"}</td>
            <td><Link className="btn btn-primary" to={`/admin/classrooms/${this.props.classroom.id}/edit`}>Edit</Link></td>
            <td><Link className="btn btn-primary" to={`/admin/classrooms/${this.props.classroom.id}`}>Delete</Link></td>
        </tr>
    }

}
