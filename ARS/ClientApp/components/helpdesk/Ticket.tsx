import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import { Ticket } from '../Model'

export type TicketComponentProps = {ticket:Ticket, key:number}

export class TicketComponent extends React.Component<TicketComponentProps, {}> {
    constructor() {
        super();
        this.state = {};
    }

    public render() {
        return <tr>
                <th scope="row">{this.props.ticket.ticketId}    </th>
                <td>{this.props.ticket.user.firstName +" "+ this.props.ticket.user.lastName}</td>
                <td>{this.props.ticket.user.username}</td>
                <td>{this.props.ticket.classroom.locationId}</td>
                <td>{this.props.ticket.classroom.name}</td>
                <td>{this.props.ticket.date}</td>
                <td>{this.props.ticket.date.getTime}</td>
                <td>{this.props.ticket.problem.name}</td>
            </tr>
    }

}
