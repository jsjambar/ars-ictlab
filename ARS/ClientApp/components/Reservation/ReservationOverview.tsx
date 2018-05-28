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
        return <div className="column reservations">
            <div className="page-header">
                <h1>Reservations</h1>
            </div>
            {
                this.state.reservations != "Loading..." ?
                    <div className="row tbl">
                        <div className="row head">
                            <strong className="col-xs-1 first">#</strong>
                            <strong className="col-xs-2">Classroom Id</strong>
                            <strong className="col-xs-3 col-sm-2">Date of reservation</strong>
                            <strong className="col-xs-2">Start Time</strong>
                            <strong className="col-xs-2">End Time</strong>
                            <strong className="col-xs-2 col-sm-3 last"></strong>
                        </div>
                        <div className="row body">
                            {this.state.reservations.map((u, k) => <ReservationComponent key={k} reservation={u} />)}
                        </div>
                    </div>
                    : "Loading..."
            }
        </div>
    }

}
