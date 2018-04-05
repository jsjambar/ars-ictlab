import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { Ticket, User, Classroom, Problem, Location } from '../Model';
import * as api from '../Api';
import { Link } from 'react-router-dom'

export type TicketComponentProps = {ticket:Ticket, key:number, type:"user"|"system"}

interface TicketState{
    user: User,
    classroom: Classroom,
    problem: Problem,
    location: Location
} 

export class TicketComponent extends React.Component<TicketComponentProps, TicketState> {
    constructor() {
        super();
        this.state = {
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
                is_disabled: true
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

    getUser(){
        api.getUser(this.props.ticket.user_id)
        .then(user => {
              this.setState({user:user})
        })
        .catch(e => console.log("getUser, " + e))
    }

    getProblem(){
        api.getProblem(this.props.ticket.problem_id)
        .then(problem => {
              this.setState({problem:problem})
        })
        .catch(e => console.log("getProblem, " + e))
    }

    getClassroom(){
        api.getClassroom(this.props.ticket.classroom_id)
        .then(classroom => {
              this.setState({classroom:classroom}),
              this.getLocation(classroom.location_id)
        })
        .catch(e => console.log("getClassroom, " + e))
    }

    getLocation(location_id: Number){
        api.getLocation(location_id)
        .then(location => {
              this.setState({location:location})
        })
        .catch(e => console.log("getLocation, " + e))
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
            .then(m => console.log("success, " + m));
        }
    }

    usershow(g, solved){
        return <tr> 
            <th scope="row">{this.props.ticket.id}</th>
            <td>{this.state.user.first_name + this.state.user.last_name}</td>
            <td>{this.state.user.username}</td>
            <td>{this.state.location.name}</td>
            <td>{this.state.classroom.name}</td>
            <td>{g.getDay() + "-" + g.getMonth() + "-" + g.getFullYear()}</td>
            <td>{g.getHours() + ":" + g.getMinutes()}</td>
            <td>{this.state.problem.name}</td>
            <td>{solved}</td>
            <td><Link className="btn btn-primary" to={`/Helpdesk/Tickets/${this.props.ticket.id}/edit`}>Edit</Link></td>
            <td><button onClick={this.delete_Ticket.bind(this.props.ticket.id)} className="btn btn-primary">Delete</button></td>
        </tr>
    }

    systemshow(g, solved){
        return <tr> 
            <th scope="row">{this.props.ticket.id}</th>
            <td>{this.state.location.name}</td>
            <td>{this.state.classroom.name}</td>
            <td>{g.getDay() + "-" + g.getMonth() + "-" + g.getFullYear()}</td>
            <td>{g.getHours() + ":" + g.getMinutes()}</td>
            <td>{this.state.problem.name}</td>
            <td>{solved}</td>
            <td><Link className="btn btn-primary" to={`/Helpdesk/Tickets/${this.props.ticket.id}/edit`}>Edit</Link></td>
            <td><button onClick={this.delete_Ticket.bind(this.props.ticket.id)} className="btn btn-primary">Delete</button></td>
        </tr>
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
