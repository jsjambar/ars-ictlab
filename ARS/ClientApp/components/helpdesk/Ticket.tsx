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
                <th scope="row">{this.props.ticket.TicketId}    </th>
                <td>{this.props.ticket.Student.firstName +" "+ this.props.ticket.Student.firstName}</td>
                <td>{this.props.ticket.StudentNumber}</td>
                <td>{this.props.ticket.Location}</td>
                <td>{this.props.ticket.Room}</td>
                <td>{this.props.ticket.Date}</td>
                <td>{this.props.ticket.Time}</td>
                <td>{this.props.ticket.TypeProblem.Name}</td>
            </tr>
    }

}
