import * as React from 'react';
import * as immutable from 'immutable'
import * as api from '../Api'
import { RouteComponentProps } from 'react-router'
import { Error, ClassroomWithEvents } from '../Model'
import * as moment from 'moment';

// Schedule
import BigCalendar from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css"

// Authentication
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
export type ScheduleState = {auth:Auth, errors:immutable.List<Error>, userReservations: Array<ClassroomWithEvents>}
export class Schedule extends React.Component<RouteComponentProps<{}>, ScheduleState> {

    constructor() {
        super();
        this.state = {
            userReservations: Array<ClassroomWithEvents>(),
            errors:immutable.List<Error>(),
            auth:{
                is_loggedin:false,
                user:null,
                permission:0 // 0 = No Permission, 1 = Student, 2 = Administrator
            }
        }
    }

    // Check the authentication of the user when mounting and handle accordingly
    componentWillMount():void{
        this.check_auth()
    }
 
    // Check the authentication of the user and handle accordingly
    check_auth():void{
        Authentication.check_auth()
        .then(r => this.setState({...this.state, auth:r}))
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Something went wrong checking the permission."}))
    }

    // Handle authentication of the user
    handle_auth():void{
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        :this.state.auth.permission == 2 ?
            this.handle_admin()
        :
        this.getUserEvents(this.state.auth.user.id);
    }

    getUserEvents(userid) {
        api.getUserEvents(userid)
            .then(events => this.setUserReservations(events))
            .catch(e => this.set_error({num:15, msg: "User Events Not Found."}))
    }

    setUserReservations(events){
        var arrReservations = [];
        events.forEach(element => {
            arrReservations.push(
                {
                    title: element.classroom + " at " + element.title,
                    start: new Date(element.start),
                    end: new Date(element.end)
                }
            )
        });

        this.setState({ userReservations: arrReservations });
    }

    // Handle authentication of student
    handle_user():void{
        this.setState({...this.state, errors:immutable.List<Error>()})
    }

    // Handle authentication of admin
    handle_admin():void{
        this.setState({...this.state, errors:immutable.List<Error>()})
        window.location.replace('/admin/classrooms/overview')
    }

    // Set errors if they dont exist already
    set_error(error:Error):void{
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        :null
    }

    public render() {
        return <div>
            <div className="page-header">
                <h1>Your schedule</h1>
            </div>
            <div>
                {
                    // Show errors
                    this.state.errors.map(e => {
                       return <div className="alert alert-danger" role="alert">
                            <p>{e.msg}</p>
                       </div>
                    })
                }
            </div>
            <BigCalendar 
                views={Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])} 
                events={this.state.userReservations} 
                timeslots={3}
                step={60}
                defaultDate={new Date()}
                defaultView="month"
                showMultiDayTimes />
        </div>
    }
}
