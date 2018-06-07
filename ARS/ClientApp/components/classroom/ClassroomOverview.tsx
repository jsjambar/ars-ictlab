import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Classroom, Error } from '../Model' 
import { ClassroomComponent } from './Classroom';
import { Link } from 'react-router-dom'

interface ClassroomOverviewState { 
    classrooms: immutable.List<Classroom> | "Loading...",
    errors:immutable.List<Error>
}

export class ClassroomOverview extends React.Component<RouteComponentProps<{}>, ClassroomOverviewState> {
    constructor() {
        super();
        this.state = {
            errors:immutable.List<Error>(),
            classrooms: "Loading..."
        };
    }

    componentWillMount(){
        this.getClassrooms();
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    getClassrooms(){
        api.getClassrooms()
        .then(classrooms => this.setState({classrooms:classrooms}),() => console.log(this.state))
        .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
    }

    public render() {
        return <div className="classroomOverview">
            <div className="page-header row">
                <h1>Admin: classroom overview</h1>
                <div>
                    {
                        this.state.errors.map(e => {
                        return <div className="alert alert-danger" role="alert">
                                <p>{e.msg}</p>
                        </div>
                        })
                    }
                </div>
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
