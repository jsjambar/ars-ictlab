import * as React from 'react';
import * as immutable from 'immutable'
import { RouteComponentProps } from 'react-router';
import * as api from '../Api'
import { Reservation } from '../Model'
import { ReservationComponent } from './Reservation'

export type ReservationsState = { reservations: immutable.List<Reservation> | "Loading..." }

export class Reservations extends React.Component<RouteComponentProps<{}>, ReservationsState> {
    constructor() {
        super();
        this.state = { reservations: "Loading..." };
    }

    componentWillMount() {
        this.getReservations()
    }

    getReservations() {
        api.get_reservations()
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
