import * as React from 'react';
import * as immutable from 'immutable';
import { RouteComponentProps } from 'react-router';
import { Ticket } from '../Model'
import * as api from '../Api';
import { TicketComponent } from './Ticket';
import { Link } from 'react-router-dom';

export type TicketState = { UserTickets: immutable.List<Ticket>, SystemTickets: immutable.List<Ticket> }


export class Helpdesk extends React.Component<RouteComponentProps<{}>, TicketState> {
    constructor() {
        super();
        this.state = {
            UserTickets: immutable.List<Ticket>(),
            SystemTickets: immutable.List<Ticket>()
        };
    }

    componentWillMount() {
        this.getTickets()
    }

    getTickets() {
        api.getUserTickets()
            .then(Tickets => {
                this.setState({
                    UserTickets: Tickets[0],
                    SystemTickets: Tickets[1]
                })
            })
            .catch(e => console.log("getTickets, " + e))
    }

    public render() {
        return <div className="helpdesk">
            <div className="page-header row">
                <h1>Helpdesk overview : Student tickets</h1>
                <div className="headerBtn">
                    <Link className="btn btn-primary" to={'/helpdesk/create'}>Add</Link>
                </div>
            </div>
            <div className="row tbl">
                <div className="row head">
                    <strong className="col-xs-1 first"># Ticket</strong>
                    <strong className="col-xs-1">Student</strong>
                    <strong className="col-xs-1 col-sm-2">Student number</strong>
                    <strong className="col-xs-1">Location</strong>
                    <strong className="col-xs-1">Room</strong>
                    <strong className="col-xs-1">Date</strong>
                    <strong className="col-xs-1">Time</strong>
                    <strong className="col-xs-1">Type problem</strong>
                    <strong className="col-xs-1">Solved</strong>
                    <strong className="col-xs-2 col-sm-3 last"></strong>
                </div>
                <div className="row body">
                    {this.state.UserTickets.map((t, k) => <TicketComponent key={k} ticket={t} type={"user"} />)}
                </div>

                <div className="systemTicketDiv">
                    <div className="page-header">
                        <h4>Helpdesk overview : System tickets</h4>
                    </div>
                    <div className="row tbl">
                        <div className="row head">
                            <strong className="col-xs-1"># Ticket</strong>
                            <strong className="col-xs-2">Location</strong>
                            <strong className="col-xs-2">Room</strong>
                            <strong className="col-xs-2">Date</strong>
                            <strong className="col-xs-1">Time</strong>
                            <strong className="col-xs-1">Type problem</strong>
                            <strong className="col-xs-1">Solved</strong>
                            <strong className="col-xs-2 col-sm-3 last"></strong>
                        </div>
                        <div className="row body">
                            {this.state.SystemTickets.map((t, k) => <TicketComponent key={k} ticket={t} type={"system"} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}