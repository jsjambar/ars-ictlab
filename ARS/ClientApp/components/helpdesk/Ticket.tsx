import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { Ticket, User, Classroom, Problem } from '../Model';
import * as api from '../Api';

export type TicketComponentProps = {ticket:Ticket, key:number}

// interface TicketState{
//     user: User|0,
//     classroom: Classroom|0,
//     problem: Problem|0
// } 

export class TicketComponent extends React.Component<TicketComponentProps, {}> {
    constructor() {
        super();
        this.state = {
            // user: 0,
            // classroom: 0,
            // problem: 0
        };
    }

    componentWillMount(){
        this.getUser();
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
              this.setState({classroom:classroom})
        })
        .catch(e => console.log("getClassroom, " + e))
    }

    public render() {
            return <tr>
            <th scope="row">{this.props.ticket.id}</th>
            <td>{this.props.ticket.user_id}</td>
            <td>{this.props.ticket.user_id}</td>
            <td>{this.props.ticket.classroom_id}</td>
            <td>{this.props.ticket.classroom_id}</td>
            <td>{this.props.ticket.created_at}</td>
            <td>{this.props.ticket.created_at}</td>
            <td>{this.props.ticket.problem_id}</td>
            <td>{this.props.ticket.solved}</td>
        </tr>
    }

}
