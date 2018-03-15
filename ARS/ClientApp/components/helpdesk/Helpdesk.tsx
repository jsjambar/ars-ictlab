import * as React from 'react';
import * as immutable from 'immutable';
import { RouteComponentProps } from 'react-router';
import { Ticket } from '../Model';
import * as api from '../Api';
import { TicketComponent } from './Ticket';

export type TicketState = {tickets:immutable.List<Ticket>|"Loading..."}

export class Helpdesk extends React.Component<RouteComponentProps<{}>, TicketState> {
    constructor(){
        super();
        this.state= { tickets:"Loading..." };
    }
    

    componentWillMount(){
        this.getTickets()
    }

    getTickets(){
        api.getTickets()
        .then(tickets => this.setState({tickets:tickets}))
        .catch(e => console.log("getTickets, " + e))
    }

    public render(){
        return <div>
            <div className="page-header">
                <h4>Helpdesk overview : Student tickets</h4>
                <div className="ticketsBtn">
                    <button>Add</button>
                    <button>Edit</button>
                </div>
            </div>
            {
                this.state.tickets != "Loading..." ?
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
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.tickets.map((t,k) => <TicketComponent key={k} ticket={t} />)}
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
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
                :"loading..."
            }
        </div>
    }
}