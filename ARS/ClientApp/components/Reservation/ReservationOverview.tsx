import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { Reservation } from '../Model'
import { ReservationComponent } from './Reservation'

import * as Authentication from '../Authentication'
import { Auth } from '../Authentication'

export type ReservationsState = { reservations: immutable.List<Reservation> | "Loading...", auth:Auth }

export class Reservations extends React.Component<RouteComponentProps<{}>, ReservationsState> {
    constructor() {
        super();
        this.state = { 
            reservations: "Loading...",
            auth:{
                is_loggedin:false,
                user:null,
                permission:0
            }
        };
    }

    componentWillMount() {
        this.check_auth()
    }

    check_auth(){
        Authentication.check_auth()
        .then(r => this.setState({...this.state, auth:r}, () => this.getReservations()))
        .catch(e => console.log(e))
    }

    getReservations() {
        api.getUserReservations(this.state.auth.user.id)
        .then(reservations => this.setState({ reservations: reservations }))
        .catch(e => console.log("getReservations, " + e))
    }
    
    public render() {
        return <div>
            <div className="page-header">
                <h1>Reservations</h1>
            </div>
            {
                this.state.reservations != "Loading..." ?
                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Classroom Id</th>
                                    <th scope="col">Date of reservation</th>
                                    <th scope="col">Start Time</th>
                                    <th scope="col">End Time</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.reservations.map((u, k) => <ReservationComponent key={k} reservation={u} />)}
                            </tbody>
                        </table>
                    </div>
                    : "Loading..."
            }
        </div>
    }

}
