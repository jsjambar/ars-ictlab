import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Classroom, Error } from '../Model' 
import { ClassroomComponent } from './Classroom';
import { Link } from 'react-router-dom'
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

interface ClassroomQRState { 
    qrcode: String,
    errors:immutable.List<Error>,
    auth:Auth,
}

export class ClassroomQR extends React.Component<RouteComponentProps<{}>, ClassroomQRState> {
    constructor() {
        super();
        this.state = {
            errors:immutable.List<Error>(), 
            qrcode: "Loading...",
            auth: {
                is_loggedin:false,
                user:null,
                permission:0
            }
        };
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
        :
            this.handle_authenticated()
    }

    handle_authenticated(){
        this.setState({...this.state, errors:immutable.List<Error>()})
        this.getClassroom();
    }

    getClassroom(){
        const { match: { params } } = this.props;
        var classroomId = Object.keys(params).map(function (key) { return params[key] })[0];

        api.getClassroom(classroomId)
        .then(classroom => this.setState({ qrcode : classroom.qr_code }),() => console.log(this.state))
        .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    public render() {
        return <div>
            <div className="page-header">
                <div>
                    {
                        this.state.errors.map(e => {
                        return <div className="alert alert-danger" role="alert">
                                <p>{e.msg}</p>
                        </div>
                        })
                    }
                </div>
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
