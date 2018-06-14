import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as api from '../Api';
import * as immutable from 'immutable'
import { Error, ClassroomWithEvents } from '../Model' 

// Authentication
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

// Calendar
import BigCalendar from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css"

interface ClassroomQRState { 
    qrcode: String,
    errors:immutable.List<Error>,
    auth:Auth,
    classroomsWithReservations: Array<ClassroomWithEvents>
}

const qrCode = {
    width: '300px',
    height: 'auto'
};

export class ClassroomQR extends React.Component<RouteComponentProps<{}>, ClassroomQRState> {
    constructor() {
        super();
        this.state = {
            errors:immutable.List<Error>(), 
            qrcode: "Loading...",
            classroomsWithReservations: Array<ClassroomWithEvents>(),
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
        .then(classroom => this.setState({ qrcode : classroom.qr_code }, () => this.getClassroomsWithEvents(classroomId)))
        .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
    }

    getClassroomsWithEvents(id) {
        api.getClassroomEvents(id)
            .then(events => this.setClassroomReservations(events))
            .catch(e => this.set_error({num:9, msg:"Classrooms Not Found"}))
    }

    // Format the reservations to be able to be used in the calendar package
    setClassroomReservations(events){
        var arrReservations = [];
        events.forEach(element => {
            arrReservations.push(
                {
                    title: element.title,
                    start: new Date(element.start),
                    end: new Date(element.end)
                }
            )
        });

        this.setState({
            classroomsWithReservations: arrReservations
        })
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
            {
                this.state.qrcode != "Loading..." ?
                <div>
                    <img src={`${this.state.qrcode}`} style={qrCode} />
                </div>
                : "Loading..."
            }
            
                <div>
                    {
                        this.state.errors.map(e => {
                        return <div className="alert alert-danger" role="alert">
                                <p>{e.msg}</p>
                        </div>
                        })
                    }
                </div>
            </div>
            <BigCalendar 
                views={Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])} 
                events={this.state.classroomsWithReservations} 
                timeslots={3}
                step={60}
                defaultDate={new Date()}
                defaultView="month"
                showMultiDayTimes />
        </div>
    }

}
