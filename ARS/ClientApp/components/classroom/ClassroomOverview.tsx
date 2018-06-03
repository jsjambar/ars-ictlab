import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Classroom } from '../Model' 
import { ClassroomComponent } from './Classroom';
import { Link } from 'react-router-dom'

interface ClassroomOverviewState { 
    classrooms: immutable.List<Classroom> | "Loading..."
}

export class ClassroomOverview extends React.Component<RouteComponentProps<{}>, ClassroomOverviewState> {
    constructor() {
        super();
        this.state = { 
            classrooms: "Loading..."
        };
    }

    componentWillMount(){
        this.getClassrooms();
    }

    getClassrooms(){
        api.getClassrooms()
        .then(classrooms => this.setState({classrooms:classrooms}),() => console.log(this.state))
        .catch(e => console.log("getClassrooms, " + e))
    }

    public render() {
        return <div className="classroomOverview">
            <div className="page-header row">
                <h1>Admin: classroom overview</h1>
                <div className="headerBtn">
                    <Link className="btn btn-primary" to={`/admin/classrooms/create`}>Add</Link>
                </div>
            </div>
            {
                this.state.classrooms != "Loading..." ?
                    <div className="row tbl">
                        <div className="row head">
                            <strong className="col-xs-1 first" scope="col">#</strong>
                            <strong className="col-xs-2" scope="col">Name</strong>
                            <strong className="col-xs-2" scope="col">Location</strong>
                            <strong className="col-xs-2" scope="col">Public for students</strong>
                            <strong className="col-xs-2" scope="col">Available</strong>
                            <strong className="col-xs-3 last" scope="col"></strong>
                        </div>
                        <div className="row body">
                            {this.state.classrooms.map((c, k) => <ClassroomComponent key={k} classroom={c} />)}
                        </div>
                    </div>
                : "Loading..."
            }
        </div>
    }

}
