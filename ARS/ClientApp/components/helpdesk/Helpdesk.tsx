import * as React from 'react';
import * as immutable from 'immutable';
import { RouteComponentProps } from 'react-router';
import { Ticket } from '../Model'
import * as api from '../Api';
import { TicketComponent } from './Ticket';
import { Link } from 'react-router-dom';

export type TicketState = {tickets:immutable.List<Ticket>}

export class Helpdesk extends React.Component<RouteComponentProps<{}>, TicketState> {
    constructor(){
        super();
        let sampleTickets = [
            {
                "ticketId": 1,
                "date": "2018-03-19T12:37:03.7368648+01:00",
                "description": "Dashboard laat geen beeld zien, kan geen reservering plaatsen.",
                "image": null,
                "problemId": 1,
                "problem": {
                    "name": "Kan geen reservering plaatsen"
                },
                "classroomId": 1,
                "classroom":{
                    "name": "H.3.312",
                    "locationId": 1
                },
                "userId": 1,
                "user": {
                    "username": "0910212",
                    "firstName": "Mark",
                    "lastName": "Thal",
                    "birthDate": "0001-01-01T00:00:00",
                }
            },
            {
                "ticketId": 2,
                "date": "2018-03-19T11:49:38.8496539+01:00",
                "description": "Kan geen reservering plaatsen 1",
                "image": null,
                "problemId": 1,
                "problem": {
                    "name": "Kan geen reservering plaatsen"
                },
                "classroomId": 1,
                "classroom": {
                    "name": "H.3.312",
                    "locationId": 1
                },
                "userId": 1,
                "user": {
                    "username": "0910212",
                    "firstName": "Mark",
                    "lastName": "Thal",
                    "birthDate": "0001-01-01T00:00:00",
                }
            },
            {
                "ticketId": 3,
                "date": "2018-03-19T11:49:38.8496539+01:00",
                "description": "Kan geen reservering plaatsen 2",
                "image": null,
                "problemId": 1,
                "problem": {
                    "name": "Kan geen reservering plaatsen"
                },
                "classroomId": 1,
                "classroom": {
                    "name": "H.3.312",
                    "locationId": 1
                },
                "userId": 1,
                "user": {
                    "username": "0910212",
                    "firstName": "Mark",
                    "lastName": "Thal",
                    "birthDate": "0001-01-01T00:00:00",
                }
            },
            {
                "ticketId": 4,
                "date": "2018-03-19T11:49:38.8496539+01:00",
                "description": "Kan geen reservering plaatsen 3",
                "image": null,
                "problemId": 1,
                "problem": {
                    "name": "Kan geen reservering plaatsen"
                },
                "classroomId": 1,
                "classroom": {
                    "name": "H.3.312",
                    "locationId": 1
                },
                "userId": 1,
                "user": {
                    "username": "0910212",
                    "firstName": "Mark",
                    "lastName": "Thal",
                    "birthDate": "0001-01-01T00:00:00",
                }
            },
            {
                "ticketId": 5,
                "date": "2018-03-19T11:49:38.8496539+01:00",
                "description": "Kan geen reservering plaatsen 4",
                "image": null,
                "problemId": 1,
                "problem": {
                    "name": "Kan geen reservering plaatsen"
                },
                "classroomId": 1,
                "classroom": {
                    "name": "H.3.312",
                    "locationId": 1
                },
                "userId": 1,
                "user": {
                    "username": "0910212",
                    "firstName": "Mark",
                    "lastName": "Thal",
                    "birthDate": "0001-01-01T00:00:00",
                }
            }
        ];
        
        this.state= { tickets: immutable.List<Ticket>(sampleTickets) };
    }
    
    componentWillMount(){
        this.getTickets()
    }

    getTickets(){
        api.getTickets()
        .then(tickets => {
              
            //this.setState({tickets:tickets})
        })
        .catch(e => console.log("getTickets, " + e))
    }

    public render(){
        return <div>
            <div className="page-header">
                <h4>Helpdesk overview : Student tickets</h4>
                <div className="ticketsBtn">
                    <button type="button"><Link className='button' to={ '/TicketForm' }>Add</Link></button>
                    <button>Edit</button>
                </div>
            </div>
            {
                //this.state.tickets != "Loading..." ? 
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
                    
                    {/* <div className="systemTicketDiv">
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
                    </div> */}
                </div>
                //:"loading..."
            }
        </div>
    }
}