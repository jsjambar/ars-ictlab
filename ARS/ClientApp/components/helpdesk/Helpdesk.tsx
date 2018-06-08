import * as React from 'react';
import * as immutable from 'immutable';
import { RouteComponentProps } from 'react-router';
import { Ticket, Error } from '../Model'
import * as api from '../Api';
import { TicketComponent } from './Ticket';
import { Link } from 'react-router-dom';
import * as Authentication from '../Authentication'
import { Auth } from '../Authentication';

export type Error = {num:number, msg:string}
export type TicketState = { UserTickets:immutable.List<Ticket>, SystemTickets: immutable.List<Ticket>, auth:Auth, errors:immutable.List<Error>}

export class Helpdesk extends React.Component<RouteComponentProps<{}>, TicketState> {
    constructor() {
        super();
        this.state = {
            errors:immutable.List<Error>(),
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

    set_error(error:Error){
        const maybe_error:immutable.List<Error> = this.state.errors.filter(e => e.num == error.num).toList()
        maybe_error.count() == 0 ?
            this.setState({...this.state, errors:this.state.errors.push(error)})
        : null
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => {this.setState({...this.state, auth:r})})
        .then(() => this.handle_auth())
        .catch(e => this.set_error({num:1, msg:"Authentication Failed"}))
    }

    handle_auth(){
        this.state.auth.permission == 0 ? 
            window.location.replace('/')
        : this.handle_authenticated()
    }

    handle_authenticated(){
        this.setState({...this.state, errors:immutable.List<Error>()})
        this.getTickets()
    }
    
    getTickets(){
        if(this.state.auth.is_loggedin && this.state.auth.permission == 1)
        {
            api.getUserTickets(this.state.auth.user.id)
            .then(Tickets => {
                this.setState({UserTickets:Tickets})
            })
            .catch(e => this.set_error({num:11, msg:"Tickets Not Found"}))
        }
        else if(this.state.auth.is_loggedin && this.state.auth.permission == 2)
        {
            api.getAllTickets()
            .then(Tickets => {
                this.setState({UserTickets:Tickets[0],
                    SystemTickets:Tickets[1]})
            })
            .catch(e => this.set_error({num:11, msg:"Tickets Not Found"}))
        }
    }

    StudentTickets(){
        return <div> 
                    <div className="page-header row">
                        <h1>Helpdesk overview : Student tickets</h1>
                        <div>
                            {
                                this.state.errors.map(e => {
                                return <div className="alert alert-danger" role="alert">
                                        <p>{e.msg}</p>
                                </div>
                                })
                            }
                        </div>
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
                    </div>
                </div>
    }

    public render(){
        return <div>
            {
                this.state.auth.permission == 1 ?
                    <div>
                        {
                            this.StudentTickets()
                        }
                    </div>
                : this.state.auth.permission == 2 ?
                    <div>
                        {
                            this.StudentTickets()
                        }

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
                :
                null
                }
            </div>
    }
}