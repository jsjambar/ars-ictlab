import * as React from 'react';
import * as immutable from 'immutable';
import { RouteComponentProps } from 'react-router';
import { Ticket } from '../Model'
import * as api from '../Api';
import { TicketComponent } from './Ticket';
import { Link } from 'react-router-dom';
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication';

export type TicketState = { UserTickets:immutable.List<Ticket>, SystemTickets: immutable.List<Ticket>, auth:Auth}

export class Helpdesk extends React.Component<RouteComponentProps<{}>, TicketState> {
    constructor(){
        super();
        this.state= {
            UserTickets: immutable.List<Ticket>(),
            SystemTickets: immutable.List<Ticket>(),
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            }
        };
    }
    
    componentWillMount(){
        this.check_auth()
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => {
            this.setState({...this.state, auth:r}),
            this.getTickets()
        })
        .catch(e => console.log("getClassroom, " + e))

    }

    getTickets(){
        if(this.state.auth.is_loggedin && this.state.auth.permission == 1)
        {
            api.getUserTickets(this.state.auth.user.id)
            .then(Tickets => {
                this.setState({UserTickets:Tickets})
            })
            .catch(e => console.log("getUserTickets, " + e))
        }
        else if(this.state.auth.is_loggedin && this.state.auth.permission == 2)
        {
            api.getAllTickets()
            .then(Tickets => {
                this.setState({UserTickets:Tickets[0],
                    SystemTickets:Tickets[1]})
            })
            .catch(e => console.log("getAllTickets, " + e))
        }
    }

    public render(){
        return <div>
            {
                this.state.auth.permission == 1 ?
                    <div>
                        <div className="page-header">
                            <h4>Helpdesk overview : Your tickets</h4>
                            <div className="ticketsBtn">
                                <Link className="btn btn-primary" to={ '/helpdesk/create' }>Add</Link>
                            </div>
                        </div>
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
                                        </tr>
                                </thead>
                                <tbody>
                                    {this.state.UserTickets.map((t,k) => <TicketComponent key={k} ticket={t} type={"user"} />)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                : this.state.auth.permission == 2 ?
                    <div>
                        <div className="page-header">
                            <h4>Helpdesk overview : Student tickets</h4>
                            <div className="ticketsBtn">
                                <Link className="btn btn-primary" to={ '/helpdesk/create' }>Add</Link>
                            </div>
                        </div>
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
                                    {this.state.UserTickets.map((t,k) => <TicketComponent key={k} ticket={t} type={"user"} />)}
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
                                    {this.state.SystemTickets.map((t,k) => <TicketComponent key={k} ticket={t} type={"system"} />)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                :
                    <h4>No access</h4>
                }
            </div>
    }
}