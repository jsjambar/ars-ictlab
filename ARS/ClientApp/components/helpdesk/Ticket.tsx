import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { Ticket, User, Classroom, Problem, Location, Error } from '../Model';
import * as api from '../Api';
import { Link } from 'react-router-dom'

export type Error = {num:number, msg:string}
export type TicketComponentProps = {ticket:Ticket, key:number, type:"user"|"system"}

interface TicketState{
    user: User,
    classroom: Classroom,
    problem: Problem,
    location: Location,
    errors:immutable.List<Error>
} 

export class TicketComponent extends React.Component<TicketComponentProps, TicketState> {
    constructor() {
        super();
        this.state = {
            errors:immutable.List<Error>(),
            user: {
                id: 0,
                first_name: "",
                last_name: "",
                username: "",
                password: "",
                role_id: 0
            },
            classroom:{
                id: 0,
                name: "",
                start_time: new Date,
                end_time: new Date,
                location_id: 0,
                is_public: false,
                is_disabled: true,
                qr_code: ""
            },
            problem:{
                id:0,
                name: ""
            },
            location: {
                id:0,
                name: ""
            }
        };
    }

    componentWillMount(){
        if(this.props.ticket.user_id != null){
            this.getUser();
        }
        this.getProblem();
        this.getClassroom();
    }

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    getUser(){
        if(this.props.ticket.user_id != 0){
            api.getUser(this.props.ticket.user_id)
            .then(user => {
                this.setState({user:user})
            })
            .catch(e => this.set_error({num:12, msg:"User Not Found"}))
        }
    }

    getProblem(){
        api.getProblem(this.props.ticket.problem_id)
        .then(problem => {
              this.setState({problem:problem})
        })
        .catch(e => this.set_error({num:13, msg:"Problem Not Found"}))
    }

    getClassroom(){
        api.getClassroom(this.props.ticket.classroom_id)
        .then(classroom => {
              this.setState({classroom:classroom}),
              this.getLocation(classroom.location_id)
        })
        .catch(e => this.set_error({num:9, msg:"Classroom Not Found"}))
    }

    getLocation(location_id: Number){
        api.getLocation(location_id)
        .then(location => {
              this.setState({location:location})
        })
        .catch(e => this.set_error({num:8, msg:"Location Not Found"}))
    }

    delete_Ticket(){
        var wantsToDelete = window.confirm("Are you sure you want to delete this Ticket?");
        if(wantsToDelete){
            var ticket_id = this;
            api.deleteTicket(ticket_id)
            .then(function(deleted){
                if(deleted){
                    location.reload();
                }
            })
            .catch(e => this.set_error({num:14, msg:"Ticket Not Found"}))
            window.location.replace('/helpdesk/overview');
        }
    }

    usershow(g, solved){
        return <div className="row">
            <strong className="col-xs-1 first">{this.props.ticket.id}</strong>
            <div className="col-xs-1">{this.state.user.first_name + this.state.user.last_name}</div>
            <div className="col-xs-1">{this.state.user.username}</div>
            <div className="col-xs-1">{this.state.location.name}</div>
            <div className="col-xs-1">{this.state.classroom.name}</div>
            <div className="col-xs-1">{g.getDay() + "-" + g.getMonth() + "-" + g.getFullYear()}</div>
            <div className="col-xs-1">{g.getHours() + ":" + g.getMinutes()}</div>
            <div className="col-xs-1">{this.state.problem.name}</div>
            <div className="col-xs-1">{solved}</div>
            <Link className="btn btn-primary" to={`/Helpdesk/Tickets/${this.props.ticket.id}/edit`}>Edit</Link>
            <button onClick={this.delete_Ticket.bind(this.props.ticket.id)} className="btn btn-primary btn-last">Delete</button>
        </div>
    }

    systemshow(g, solved){
        return <div className="row">
            <strong className="col-xs-1 first">{this.props.ticket.id}</strong>
            <div className="col-xs-1">{this.state.location.name}</div>
            <div className="col-xs-2">{this.state.classroom.name}</div>
            <div className="col-xs-1">{g.getDay() + "-" + g.getMonth() + "-" + g.getFullYear()}</div>
            <div className="col-xs-1">{g.getHours() + ":" + g.getMinutes()}</div>
            <div className="col-xs-2">{this.state.problem.name}</div>
            <div className="col-xs-1">{solved}</div>
            <div className="col-xs-2 col-sm-3 last">
                <Link className="btn btn-primary" to={`/Helpdesk/Tickets/${this.props.ticket.id}/edit`}>Edit</Link>
                <button onClick={this.delete_Ticket.bind(this.props.ticket.id)} className="btn btn-primary btn-last">Delete</button>
            </div>
        </div>
    }

    public render() {
        var g = new Date(this.props.ticket.created_at);

        var solved = ""
        if(this.props.ticket.solved){
            solved = "Solved"
        }else{
            solved = "Not solved"
        }

        if(this.props.type == "user"){
            return this.usershow(g, solved)
        }
        else{
            return this.systemshow(g, solved)
        }

    }
}
