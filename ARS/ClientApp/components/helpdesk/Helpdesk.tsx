import * as React from 'react';
import * as immutable from 'immutable';
import { RouteComponentProps } from 'react-router';
import { Ticket } from '../Model'
import * as api from '../Api';
import { TicketComponent } from './Ticket';
import { Link } from 'react-router-dom';

export type TicketState = { tickets:immutable.List<Ticket> }


export class Helpdesk extends React.Component<RouteComponentProps<{}>, TicketState> {
    constructor(){
        super();
        this.state= {
            tickets: immutable.List<Ticket>()
        };
    }
    
    componentWillMount(){
        this.getTickets()
    }

    getTickets(){
        api.getTickets()
        .then(tickets => {
              this.setState({tickets:tickets})
        })
        .catch(e => console.log("getTickets, " + e))
    }

    public render(){
        return <div>
            <div className="page-header">
                <h4>Helpdesk overview : Student tickets</h4>
                <div className="ticketsBtn">
                    <Link className="btn btn-primary" to={ '/Helpdesk/Add/TicketForm' }>Add</Link>
                </div>
            </div>
                <div>
                    <div>
                        <table className="table">
                            <thead>
                                    <tr>
                                        <th scope="col"># Ticket</th>
                                        <th scope="col">Student</th>
                                        <th scope="col">Student number</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Room</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Time</th>
                                        <th scope="col">Type problem</th>
                                        <th scope="col">Solved</th>
                                        <th scope="col"></th>
                                        <th scope="col"></th>
                                    </tr>
                            </thead>
                            <tbody>
                                {this.state.tickets.map((t,k) => <TicketComponent key={k} ticket={t} type={"user"} />)}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="systemTicketDiv">
                        <div className="page-header">
                            <h4>Helpdesk overview : System tickets</h4>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"># Ticket</th>
                                    <th scope="col">Location</th>
                                    <th scope="col">Room</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Type problem</th>
                                    <th scope="col">Solved</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                {this.state.tickets.map((t,k) => <TicketComponent key={k} ticket={t} type={"system"} />)}
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    }
}