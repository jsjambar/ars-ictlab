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
        return <div>
            <div className="page-header">
                <h4>Admin: classroom overview</h4>
                <div className="ticketsBtn">
                    <Link className="btn btn-primary" to={`/admin/classrooms/create`}>Add</Link>
                </div>
            </div>
            {
                this.state.classrooms != "Loading..." ?
                <div>
                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Public for students</th>
                                    <th scope="col">Available</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.classrooms.map((c,k) => <ClassroomComponent key={k} classroom={c} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
                : "Loading..."
            }
        </div>
    }

}
