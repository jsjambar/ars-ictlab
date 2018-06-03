import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Classroom } from '../Model' 
import { ClassroomComponent } from './Classroom';
import { Link } from 'react-router-dom'

interface ClassroomQRState { 
    qrcode: String
}

export class ClassroomQR extends React.Component<RouteComponentProps<{}>, ClassroomQRState> {
    constructor() {
        super();
        this.state = { 
            qrcode: "Loading..."
        };
    }

    componentWillMount(){
        this.getClassroom();
    }

    getClassroom(){
        const { match: { params } } = this.props;
        var classroomId = Object.keys(params).map(function (key) { return params[key] })[0];

        api.getClassroom(classroomId)
        .then(classroom => this.setState({ qrcode : classroom.qr_code }),() => console.log(this.state))
        .catch(e => console.log("getClassrooms, " + e))
    }

    public render() {
        return <div>
            <div className="page-header">
                <h4></h4>
                <div className="ticketsBtn">
                    <Link className="btn btn-primary" to={`/admin/classrooms/create`}>Add</Link>
                </div>
            </div>
            {
                this.state.qrcode != "Loading..." ?
                <div>
                    <img src={`${this.state.qrcode}`} />
                </div>
                : "Loading..."
            }
        </div>
    }

}
